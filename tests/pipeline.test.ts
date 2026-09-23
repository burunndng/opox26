/**
 * Phase B (Local-first pipeline) tests — offline heuristics + chunker + PDF import.
 * Fully isolated; no network, no AI, no ./data access.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { suggestAtoms, splitIntoChunks, splitSentences } from '../server/heuristics.ts';
import { parsePdf, PdfImportError } from '../server/pdfImport.ts';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const PRESCRIPCION_TEXT = `Artículo 53. El derecho al reconocimiento de las prestaciones prescribe a los cinco años, contados desde el día siguiente a aquel en que tenga lugar el hecho causante de la prestación. El derecho al percibo de las prestaciones a tanto alzado caducará a los 3 meses anteriores a la fecha de la solicitud, sin perjuicio de lo dispuesto en el art. 54 TRLGSS. El INSS será el órgano competente para el reconocimiento de las prestaciones, salvo que la gestión corresponda a una mutua colaboradora con la Seguridad Social. La revalorización de las pensiones contributivas será del 2,7% en 2026. El coeficiente de cómputo del trabajador fijo-discontinuo es 1,5.`;

function buildMinimalPdf(line: string): Uint8Array {
  const content = `BT /F1 12 Tf 72 720 Td (${line}) Tj ET`;
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefPos = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

// ---------------------------------------------------------------------------
// B1–B4: heuristics
// ---------------------------------------------------------------------------

describe('Phase B: Offline atom heuristics', () => {
  test('B1. Types the prescripción cluster: deadlines, exception, body, %, coefficient', () => {
    const suggestions = suggestAtoms(PRESCRIPCION_TEXT);
    assert.ok(suggestions.length >= 4, `Expected >= 4 suggestions, got ${suggestions.length}`);

    const deadlines = suggestions.filter((s) => s.atom_type === 'deadline');
    assert.ok(deadlines.length >= 1, 'prescripción/caducidad sentence must be a deadline atom');
    assert.ok(
      deadlines.some((d) => /\b(cinco años|5 años|3 meses)\b/i.test(d.text)),
      'deadline atom must carry the actual numeric plazo'
    );

    const exceptions = suggestions.filter((s) => s.atom_type === 'exception');
    assert.ok(
      exceptions.some((e) => /sin perjuicio|salvo/i.test(e.text)),
      '"sin perjuicio"/"salvo" sentence must be typed as exception'
    );

    assert.ok(
      suggestions.some((s) => s.atom_type === 'competent_body' && /INSS|mutua/i.test(s.text)),
      'INSS/mutua sentence must be typed as competent_body'
    );
    assert.ok(
      suggestions.some((s) => s.atom_type === 'percentage' && /2,7/.test(s.text)),
      'revalorización 2,7% must be typed as percentage'
    );
    assert.ok(
      suggestions.some((s) => s.atom_type === 'coefficient' && /1,5/.test(s.text)),
      'coeficiente 1,5 must be typed as coefficient'
    );
  });

  test('B2. Extracts legal-basis references', () => {
    const suggestions = suggestAtoms(PRESCRIPCION_TEXT);
    const withBasis = suggestions.find((s) => s.legal_basis && /54/i.test(s.legal_basis));
    assert.ok(withBasis, 'a sentence citing art. 54 must get a legal_basis guess');
  });

  test('B3. Deduplicates repeated sentences and ignores short/noise text', () => {
    const noisy = 'Hola. Sí. 123. ' + 'El plazo será de cinco años desde el hecho causante. '.repeat(3);
    const suggestions = suggestAtoms(noisy);
    const texts = suggestions.map((s) => s.text.toLowerCase());
    assert.equal(new Set(texts).size, texts.length, 'no duplicate suggestions');
    assert.ok(suggestions.length <= 2, `noise + one repeated sentence → <= 2 atoms, got ${suggestions.length}`);
  });

  test('B4. Sentence splitter protects legal abbreviations', () => {
    const s = splitSentences('El art. 53 TRLGSS fija plazos concretos y precisos para todo. El párr. segundo añade matices importantes sobre el cómputo.');
    // "art." must NOT split the first sentence → the first fragment keeps both clauses
    assert.ok(s.length >= 1);
    assert.ok(s[0].includes('art. 53'), 'abbreviation must survive intact');
  });
});

// ---------------------------------------------------------------------------
// B5–B7: chunk splitter
// ---------------------------------------------------------------------------

describe('Phase B: Chunk splitter', () => {
  test('B5. Splits on Artículo headings and keeps the heading with its body', () => {
    const text = `Preambulo corto pero suficiente para ser un segmento valido de texto legal.\n\nArtículo 53 TRLGSS. El derecho al reconocimiento prescribe a los cinco años.\n\nArtículo 54 TRLGSS. El derecho al percibo caduca al año.`;
    const chunks = splitIntoChunks(text);
    assert.ok(chunks.length >= 3, `Expected >= 3 chunks, got ${chunks.length}`);
    const art53 = chunks.find((c) => /Artículo 53/i.test(c.article_reference || ''));
    const art54 = chunks.find((c) => /Artículo 54/i.test(c.article_reference || ''));
    assert.ok(art53, 'chunk for Artículo 53 with article_reference');
    assert.ok(art54, 'chunk for Artículo 54 with article_reference');
    assert.ok(art53!.raw_text.startsWith('Artículo 53'), 'heading stays with its body');
    assert.deepEqual(chunks.map((c) => c.order_index), chunks.map((_, i) => i), 'order_index is sequential');
  });

  test('B6. Preserves page numbers from PDF page arrays', () => {
    const chunks = splitIntoChunks([
      { pageNumber: 1, text: 'Contenido de la primera pagina del temario con suficiente texto legal.' },
      { pageNumber: 2, text: 'Contenido de la segunda pagina del temario con suficiente texto legal.' },
    ]);
    assert.equal(chunks.length, 2);
    assert.equal(chunks[0].page_number, 1);
    assert.equal(chunks[1].page_number, 2);
  });

  test('B7. Long segments fall back to paragraph grouping under 2500 chars', () => {
    const para = 'Regla legal con plazo de cinco años y porcentaje del treinta por ciento aplicable. ';
    const longText = `Artículo 1. ${para.repeat(150)}`;
    const chunks = splitIntoChunks(longText);
    assert.ok(chunks.length >= 2, 'long article must be split into multiple chunks');
    assert.ok(chunks.every((c) => c.raw_text.length <= 2600), 'each chunk respects the size cap');
    assert.ok(chunks.every((c) => /Art[ií]culo 1/.test(c.article_reference || '')), 'article ref inherited by all parts');
  });
});

// ---------------------------------------------------------------------------
// B8–B10: PDF import (pdfjs-dist, offline)
// ---------------------------------------------------------------------------

describe('Phase B: Offline PDF import', () => {
  test('B8. Extracts text from a minimal valid PDF', async () => {
    const pdf = buildMinimalPdf('El plazo sera de cinco anos');
    const result = await parsePdf(pdf);
    assert.equal(result.pageCount, 1);
    assert.equal(result.pages.length, 1);
    assert.equal(result.pages[0].pageNumber, 1);
    assert.match(result.fullText, /plazo/i);
    assert.match(result.fullText, /cinco anos/i);
  });

  test('B9. Corrupt PDF → friendly PdfImportError (paste fallback)', async () => {
    const garbage = new TextEncoder().encode('esto no es un pdf válido %PDF-1.4 roto');
    await assert.rejects(
      () => parsePdf(garbage),
      (err: unknown) => {
        assert.ok(err instanceof PdfImportError);
        assert.match((err as Error).message, /No se pudo leer el PDF|pegar el texto/i);
        return true;
      }
    );
  });

  test('B10. Text-less PDF → scanned-PDF guidance error', async () => {
    // Valid structure but empty content stream → <20 extractable chars
    const content = '';
    const objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << >> >>',
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    ];
    let pdf = '%PDF-1.4\n';
    const offsets: number[] = [0];
    objects.forEach((body, i) => {
      offsets.push(pdf.length);
      pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
    });
    const xrefPos = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objects.length; i++) {
      pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

    await assert.rejects(
      () => parsePdf(new TextEncoder().encode(pdf)),
      (err: unknown) => {
        assert.ok(err instanceof PdfImportError);
        assert.match((err as Error).message, /escaneado|extra[ií]ble|No se pudo extraer/i);
        return true;
      }
    );
  });
});
