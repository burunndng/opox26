#!/usr/bin/env python3
"""extract_material.py - extract study-material text for oposilab-material-resumen.

Reads one input file (PDF, PPT/PPTX, DOC/DOCX, TXT, MD) and writes a UTF-8 plain-text
extraction to the requested output path (default: /tmp/opencode/<basename>.txt).

Refuses to overwrite an existing output unless --force is given.

Exit codes:
  0  success
  1  input missing / unsupported format / extraction error
  2  extraction produced no usable text (likely image-only: OCR not available)
  3  output exists and --force was not given
"""

from __future__ import annotations

import argparse
import posixpath
import re
import shutil
import subprocess
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"

TEXT_SUFFIXES = {".txt", ".md", ".markdown", ".text"}


def _run(cmd: list[str]) -> tuple[str, str, int]:
    proc = subprocess.run(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
        text=True, errors="replace", check=False,
    )
    return proc.stdout, proc.stderr, proc.returncode


def _read_text(path: Path) -> str:
    raw = path.read_bytes()
    for enc in ("utf-8-sig", "utf-8", "cp1252", "latin-1"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", errors="replace")


def _nonspace_len(text: str) -> int:
    return len(re.sub(r"\s", "", text))


# --------------------------------------------------------------------------
# DOCX
# --------------------------------------------------------------------------
def _docx_paragraph(el: ET.Element) -> str:
    out: list[str] = []
    for node in el.iter():
        tag = node.tag
        if tag == W + "t":
            out.append(node.text or "")
        elif tag == W + "tab":
            out.append("\t")
        elif tag in (W + "br", W + "cr"):
            out.append("\n")
    return "".join(out)


def _docx_table(el: ET.Element) -> str:
    rows: list[str] = []
    for tr in el.findall(W + "tr"):
        cells: list[str] = []
        for tc in tr.findall(W + "tc"):
            parts = [_docx_paragraph(p).strip() for p in tc.findall(W + "p")]
            cells.append(" ".join(p for p in parts if p))
        rows.append(" | ".join(cells))
    return "\n".join(rows)


def _extract_docx(path: Path) -> tuple[str, list[str]]:
    warnings: list[str] = []
    with zipfile.ZipFile(path) as z:
        names = set(z.namelist())
        if "word/document.xml" not in names:
            raise ValueError("not a valid .docx (word/document.xml missing)")

        root = ET.fromstring(z.read("word/document.xml"))
        body = root.find(W + "body")
        blocks: list[str] = []
        if body is not None:
            for child in body:
                if child.tag == W + "p":
                    text = _docx_paragraph(child).strip()
                    if text:
                        blocks.append(text)
                elif child.tag == W + "tbl":
                    text = _docx_table(child).strip()
                    if text:
                        blocks.append(text)

        extras: list[str] = []
        extra_re = re.compile(
            r"word/(header\d*|footer\d*|footnotes|endnotes|comments)\.xml$"
        )
        for name in sorted(names):
            if not extra_re.match(name):
                continue
            try:
                eroot = ET.fromstring(z.read(name))
            except ET.ParseError:
                warnings.append(f"no se pudo analizar {name}")
                continue
            paras = [_docx_paragraph(p).strip() for p in eroot.iter(W + "p")]
            paras = [p for p in paras if p]
            if paras:
                extras.append(f"### {name}\n" + "\n".join(paras))
        if extras:
            blocks.append("\n\n".join(extras))

    text = "\n\n".join(blocks)
    if not text.strip():
        warnings.append("no se extrajo texto del .docx; puede contener solo imágenes")
    return text, warnings


# --------------------------------------------------------------------------
# PPTX
# --------------------------------------------------------------------------
def _pptx_paragraph(el: ET.Element) -> str:
    out: list[str] = []
    for node in el.iter():
        if node.tag == A + "t":
            out.append(node.text or "")
        elif node.tag == A + "br":
            out.append("\n")
    return "".join(out)


def _slide_number(name: str) -> int:
    m = re.search(r"slide(\d+)\.xml$", name)
    return int(m.group(1)) if m else 0


def _extract_pptx(path: Path) -> tuple[str, list[str]]:
    warnings: list[str] = []
    with zipfile.ZipFile(path) as z:
        names = set(z.namelist())
        slides = sorted(
            (n for n in names if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)),
            key=_slide_number,
        )
        if not slides:
            raise ValueError("not a valid .pptx (no ppt/slides/slide*.xml found)")

        notes_by_slide: dict[int, str] = {}
        for slide in slides:
            num = _slide_number(slide)
            rels_name = f"ppt/slides/_rels/slide{num}.xml.rels"
            if rels_name not in names:
                continue
            try:
                rels = ET.fromstring(z.read(rels_name))
            except ET.ParseError:
                continue
            for rel in rels:
                if (rel.get("Type") or "").endswith("/notesSlide"):
                    target = rel.get("Target") or ""
                    full = posixpath.normpath(
                        posixpath.join(posixpath.dirname(slide), target)
                    )
                    notes_by_slide[num] = full

        blocks: list[str] = []
        empty: list[int] = []
        for slide in slides:
            num = _slide_number(slide)
            try:
                root = ET.fromstring(z.read(slide))
            except ET.ParseError:
                warnings.append(f"diapositiva {num} no se pudo analizar")
                continue
            lines = [
                line
                for line in (_pptx_paragraph(p).strip() for p in root.iter(A + "p"))
                if line
            ]
            slide_text = "\n".join(lines)
            if not slide_text:
                empty.append(num)
                slide_text = "[SIN TEXTO EXTRAÍBLE]"
            blocks.append(f"<!-- slide:{num} -->\n{slide_text}")

            notes_name = notes_by_slide.get(num)
            if notes_name and notes_name in names:
                try:
                    nroot = ET.fromstring(z.read(notes_name))
                except ET.ParseError:
                    continue
                notes = []
                for p in nroot.iter(A + "p"):
                    line = "".join(t.text or "" for t in p.iter(A + "t")).strip()
                    if line and not line.isdigit():
                        notes.append(line)
                if notes:
                    blocks.append(f"<!-- notes:slide:{num} -->\n" + "\n".join(notes))

    text = "\n\n".join(blocks)
    if empty:
        warnings.append(
            "diapositivas sin texto extraíble: "
            + ", ".join(str(n) for n in empty)
            + " (revisar imágenes; sin OCR disponible)"
        )
    return text, warnings


# --------------------------------------------------------------------------
# PDF
# --------------------------------------------------------------------------
def _extract_pdf(path: Path, out: Path) -> tuple[int, int | None, list[str]]:
    warnings: list[str] = []
    if not shutil.which("pdftotext"):
        raise RuntimeError("pdftotext no está instalado (se requiere poppler)")

    stdout, stderr, rc = _run(["pdftotext", "-layout", "-q", str(path), str(out)])
    if rc != 0:
        raise RuntimeError(f"pdftotext falló ({rc}): {stderr.strip() or stdout.strip()}")

    pages: int | None = None
    if shutil.which("pdfinfo"):
        so, _, _ = _run(["pdfinfo", str(path)])
        m = re.search(r"^Pages:\s*(\d+)", so, re.MULTILINE)
        if m:
            pages = int(m.group(1))

    chars = _nonspace_len(_read_text(out))
    if chars < 50:
        warnings.append(
            f"capa de texto casi vacía ({chars} chars): PDF probablemente escaneado/raster; "
            "OCR no disponible (tesseract ausente). No inventar contenido."
        )
        if shutil.which("pdfimages"):
            so, _, _ = _run(["pdfimages", "-list", str(path)])
            img_lines = [ln for ln in so.splitlines()[2:] if ln.strip()][:10]
            if img_lines:
                warnings.append("imágenes incrustadas (pdfimages -list):\n  " + "\n  ".join(img_lines))

    return chars, pages, warnings


# --------------------------------------------------------------------------
# legacy DOC / PPT
# --------------------------------------------------------------------------
def _extract_with(cmd: list[str], label: str) -> tuple[str, list[str]]:
    stdout, stderr, rc = _run(cmd)
    if rc != 0:
        raise RuntimeError(f"{label} falló ({rc}): {stderr.strip() or stdout.strip()}")
    return stdout, []


def _extract_doc(path: Path) -> tuple[str, list[str]]:
    warnings: list[str] = []
    if shutil.which("antiword"):
        stdout, stderr, rc = _run(["antiword", "-m", "UTF-8.txt", str(path)])
        if rc == 0 and stdout.strip():
            return stdout, warnings
        warnings.append(f"antiword no produjo texto ({stderr.strip()}); se prueba catdoc")
    if shutil.which("catdoc"):
        text, w = _extract_with(["catdoc", str(path)], "catdoc")
        return text, warnings + w
    raise RuntimeError("ni antiword ni catdoc están disponibles para .doc")


def _extract_ppt(path: Path) -> tuple[str, list[str]]:
    warnings: list[str] = []
    if not shutil.which("catppt"):
        raise RuntimeError("catppt no está disponible para .ppt (formato binario antiguo)")
    text, w = _extract_with(["catppt", str(path)], "catppt")
    warnings += w
    warnings.append(
        "extracción de .ppt binario con cobertura limitada: verificar que no falten diapositivas"
    )
    return text, warnings


# --------------------------------------------------------------------------
# main
# --------------------------------------------------------------------------
def main() -> int:
    parser = argparse.ArgumentParser(
        description="Extract text from Oposilab study materials for summarization."
    )
    parser.add_argument("input", help="input file (.pdf/.docx/.pptx/.doc/.ppt/.txt/.md)")
    parser.add_argument("-o", "--out", help="output text file (default: /tmp/opencode/<name>.txt)")
    parser.add_argument(
        "--force", action="store_true",
        help="overwrite the output file if it already exists (only after user confirmation)",
    )
    args = parser.parse_args()

    src = Path(args.input).expanduser()
    if not src.is_file():
        print(f"ERROR: archivo no encontrado: {src}", file=sys.stderr)
        return 1

    ext = src.suffix.lower()
    out = (
        Path(args.out).expanduser()
        if args.out
        else Path("/tmp/opencode") / (src.stem + ".txt")
    )
    if out.exists() and not args.force:
        print(
            f"ERROR: el destino ya existe y no se sobrescribirá sin confirmación: {out}\n"
            "       Usa --force únicamente después de confirmarlo con el usuario.",
            file=sys.stderr,
        )
        return 3
    out.parent.mkdir(parents=True, exist_ok=True)

    warnings: list[str] = []
    meta: dict[str, object] = {}
    try:
        if ext == ".pdf":
            chars, pages, warnings = _extract_pdf(src, out)
            if pages is not None:
                meta["páginas"] = pages
            meta["caracteres"] = chars
        elif ext in TEXT_SUFFIXES:
            text = _read_text(src)
            out.write_text(text, encoding="utf-8")
            meta["caracteres"] = _nonspace_len(text)
        elif ext == ".docx":
            text, warnings = _extract_docx(src)
            out.write_text(text, encoding="utf-8")
            meta["caracteres"] = _nonspace_len(text)
            meta["diapositivas/párrafos"] = "párrafos y tablas"
        elif ext == ".pptx":
            text, warnings = _extract_pptx(src)
            out.write_text(text, encoding="utf-8")
            meta["caracteres"] = _nonspace_len(text)
            meta["diapositivas"] = text.count("<!-- slide:")
        elif ext == ".doc":
            text, warnings = _extract_doc(src)
            out.write_text(text, encoding="utf-8")
            meta["caracteres"] = _nonspace_len(text)
        elif ext == ".ppt":
            text, warnings = _extract_ppt(src)
            out.write_text(text, encoding="utf-8")
            meta["caracteres"] = _nonspace_len(text)
        else:
            print(f"ERROR: formato no soportado: {ext or '(sin extensión)'}", file=sys.stderr)
            return 1
    except (OSError, ValueError, RuntimeError, zipfile.BadZipFile, ET.ParseError) as exc:
        print(f"ERROR al extraer {src}: {exc}", file=sys.stderr)
        return 1

    print(f"formato: {ext.lstrip('.')}")
    print(f"entrada: {src}")
    print(f"salida:  {out}")
    for key, value in meta.items():
        print(f"{key}: {value}")
    for warning in warnings:
        print(f"AVISO: {warning}")

    chars = int(meta.get("caracteres", 0))
    if chars < 50:
        print(
            "AVISO: no se extrajo texto suficiente; revisar el archivo original. "
            "No inventar contenido.",
            file=sys.stderr,
        )
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
