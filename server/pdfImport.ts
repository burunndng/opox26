import path from 'path';
import { createRequire } from 'node:module';

/**
 * Offline PDF text extraction (spec §8.1) using pdfjs-dist legacy build.
 * No network, no AI: runs entirely on the user's machine.
 *
 * Strategy: per-page text via getTextContent, joining items into lines using
 * each item's transform Y coordinate (same heuristic pdf-parse uses).
 */

export interface PdfPage {
  pageNumber: number;
  text: string;
}

export interface PdfImportResult {
  pageCount: number;
  pages: PdfPage[];
  fullText: string;
}

export class PdfImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PdfImportError';
  }
}

interface TextItem {
  str: string;
  transform?: number[];
  hasEOL?: boolean;
}

/** Extracts text page by page. Throws PdfImportError with a friendly Spanish message. */
export async function parsePdf(data: Uint8Array | Buffer): Promise<PdfImportResult> {
  let pdfjs: typeof import('pdfjs-dist/legacy/build/pdf.mjs');
  try {
    pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  } catch (err) {
    throw new PdfImportError('El motor de PDF no está disponible (pdfjs-dist). Ejecuta: npm install');
  }

  // Silence the standard-font warning by pointing at the bundled fonts.
  const require = createRequire(import.meta.url);
  let standardFontDataUrl: string | undefined;
  try {
    standardFontDataUrl = path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'standard_fonts') + path.sep;
  } catch {
    /* optional */
  }

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(data),
    disableFontFace: true,
    useSystemFonts: false,
    standardFontDataUrl,
  });

  let doc: Awaited<typeof loadingTask.promise>;
  try {
    doc = await loadingTask.promise;
  } catch (err: any) {
    const msg = String(err?.message || err || '');
    if (/password/i.test(msg)) {
      throw new PdfImportError('El PDF está protegido con contraseña y no puede procesarse localmente.');
    }
    throw new PdfImportError(`No se pudo leer el PDF (${msg.slice(0, 140) || 'archivo corrupto o formato no válido'}). Pega el texto manualmente como alternativa.`);
  }

  const pages: PdfPage[] = [];
  try {
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const content = await page.getTextContent();
      const items = content.items as TextItem[];
      let text = '';
      let lastY: number | null = null;
      for (const item of items) {
        const y = item.transform ? item.transform[5] : null;
        if (lastY !== null && y !== null && Math.abs(y - lastY) > 2 && text.length && !text.endsWith('\n')) {
          text += '\n';
        }
        text += item.str;
        if (item.hasEOL) text += '\n';
        if (y !== null) lastY = y;
      }
      pages.push({ pageNumber: n, text: text.trim() });
    }
  } catch (err: any) {
    throw new PdfImportError(
      `No se pudo extraer el texto del PDF (${String(err?.message || err).slice(0, 140) || 'estructura no válida'}). Pega el texto manualmente como alternativa.`
    );
  } finally {
    // v6: destroy lives on the loadingTask; guard both so cleanup can never
    // mask the original error.
    try {
      await doc?.cleanup?.();
    } catch { /* ignore */ }
    try {
      await loadingTask.destroy();
    } catch { /* ignore */ }
  }

  const fullText = pages.map((p) => p.text).join('\n\n');
  if (pages.length > 0 && fullText.replace(/\s+/g, '').length < 20) {
    throw new PdfImportError(
      'El PDF no contiene texto extraíble (probablemente escaneado/solo imágenes). Usa OCR externo o pega el texto manualmente.'
    );
  }

  return { pageCount: pages.length, pages, fullText };
}
