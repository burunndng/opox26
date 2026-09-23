/**
 * Offline content heuristics (spec §8.2) — zero AI, zero network.
 *
 * 1. suggestAtoms(text): sentence-level regex detection of testable legal
 *    propositions (deadlines, numbers, coefficients, exceptions, competent
 *    bodies, legal effects…) with atom_type inference and legal-basis guess.
 * 2. splitIntoChunks(text | pages): source-chunk drafts split on page
 *    boundaries and "Artículo N" headings, with paragraph fallback for long
 *    segments.
 */

export interface AtomSuggestion {
  text: string;
  atom_type:
    | 'definition' | 'number' | 'deadline' | 'amount' | 'percentage'
    | 'coefficient' | 'condition' | 'exception' | 'competent_body'
    | 'legal_effect' | 'classification' | 'procedure' | 'right' | 'duty';
  legal_basis?: string;
  matched_markers: string[];
  confidence: number; // 0..1
}

export interface ChunkDraft {
  raw_text: string;
  page_number?: number;
  article_reference?: string;
  order_index: number;
}

// ---------------------------------------------------------------------------
// Marker lexicon (Spanish administrative law)
// ---------------------------------------------------------------------------

const MARKERS: Array<{ type: AtomSuggestion['atom_type']; label: string; re: RegExp }> = [
  { type: 'exception', label: 'excepción', re: /\b(salvo|excepto|excepci[oó]n hecha|no obstante|sin perjuicio)\b/i },
  { type: 'deadline', label: 'plazo', re: /\b(plazo|prescrib\w*|caduc\w*|d[ií]as|h[aá]bil\w*|meses|a[nñ]os)\b/i },
  { type: 'percentage', label: 'porcentaje', re: /(\d+\s*(?:%|por\s+ciento|porcentaje)|\bporcentaje\b|\brevalorizaci[oó]n\b)/i },
  { type: 'coefficient', label: 'coeficiente', re: /\b(coeficiente\s+de\s+c[oó]mputo|coeficientes|multiplicador\s+1,5|1,5|1,4)\b/i },
  { type: 'amount', label: 'importe', re: /(\d{1,3}(?:\.\d{3})*,\d{2})\s*(?:€|euros?)|(?:IPREM|SMI)\b/i },
  { type: 'competent_body', label: 'órgano', re: /\b(INSS|TGSS|ISM|IMSERSO|mutua(?:\s+de\s+trabajo)?|entidad\s+gestora(?:\s+o\s+colaboradora)?|colaboradora|empresario|empleador|servicio\s+p[uú]blico\s+de\s+empleo|SEPE|Instituto\s+Nacional\s+de\s+la\s+Seguridad\s+Social|Tesorer[ií]a\s+General\s+de\s+la\s+Seguridad\s+Social)\b/i },
  { type: 'legal_effect', label: 'efecto', re: /\b(ser[aá]\s+responsable|se\s+entender[aá]\s+por|tendr[aá]\s+la\s+consideraci[oó]n|se\s+computar[aá]|surta?\s+efectos?|efectos\s+econ[oó]micos|retroactividad|revalorizaci[oó]n)\b/i },
  { type: 'classification', label: 'clasificación', re: /\b(tendr[aá]\s+la\s+consideraci[oó]n\s+de|se\s+considerar[aá]|se\s+clasifican?|tiene\s+la\s+consideraci[oó]n\s+de|est[aá]\s+excluido|est[aá]n\s+excluidos?|incluidos?)\b/i },
  { type: 'procedure', label: 'procedimiento', re: /\b(solicitud|reclamaci[oó]n|recurso|procedimiento|resoluci[oó]n|notificaci[oó]n|alta\s+(?:de\s+)?oficio|requerimiento)\b/i },
  { type: 'right', label: 'derecho', re: /\b(derecho\s+a\s+la?\s*\w+|derechos\s+derivados|reconocimiento\s+del\s+derecho|prestaci[oó]n\s+econ[oó]mica|subsidio|pensi[oó]n)\b/i },
  { type: 'condition', label: 'condición', re: /\b(siempre\s+que|cuando\s+se\s+acredite|requisito\s+de\s+(?:alta|afiliaci[oó]n|cotizaci[oó]n)|estar\s+al\s+corriente|en\s+alta\s+o\s+asimilado)\b/i },
  { type: 'definition', label: 'definición', re: /\b(se\s+entiende\s+por|definici[oó]n|a\s+los\s+efectos\s+de\s+esta\s+ley)\b/i },
  { type: 'duty', label: 'obligación', re: /\b(obligaci[oó]n\s+de|deber[aá]|queda\s+obligado|deber\s+de\s+(?:afiliar|cotizar|ingresar))\b/i },
];

const NUMBER_RE = /\b\d+(?:[.,]\d+)?\b/;

// Article reference capture: "Artículo 53 TRLGSS", "art. 244.2 del TRLGSS", "Art. 7 Ley 35/2006"
// Note: [ií]? and c? are BOTH optional so "art.", "artic." and "artículo" all match.
const ARTICLE_RE =
  /\b(?:art[ií]?c?\.?|artículo)\s*\.?\s*(\d+(?:\.\d+)*(?:\s*(?:bis|ter|quáter|quater))?(?:\s+(?:del?\s+)?(?:TRLGSS|RDLgss|RDLGIT|RDL|LGSS|TRLGSS|CE|ET|Ley\s+[\d/]+|Real\s+Decreto\s+[\d/]+|Decreto\s+de\s+\d+\s+de\s+\w+\s+de\s+\d{4}))?)/i;

// Priority when several markers hit: most testable/interference-prone first.
const TYPE_PRIORITY: AtomSuggestion['atom_type'][] = [
  'exception', 'deadline', 'percentage', 'coefficient', 'amount', 'number',
  'competent_body', 'legal_effect', 'classification', 'procedure', 'condition',
  'right', 'duty', 'definition',
];

/** Splits text into sentences tolerant of legal abbreviations (art., párr., S.A., etc.). */
export function splitSentences(text: string): string[] {
  const protectedText = text
    .replace(/\b(art|p[aá]rr|p[aá]g|n[uú]m|etc|S\.A|S\.L|Inc)\./gi, (m) => m.replace(/\./g, '∯'))
    .replace(/\b([IVXLC]+)\.(?=\s)/g, '$1∯'); // roman numerals "II."
  return protectedText
    .split(/(?<=[.;:])\s+(?=[A-ZÁÉÍÓÚÑÜ¿(])/)
    .map((s) => s.replace(/∯/g, '.').trim())
    .filter((s) => s.length >= 25 && /\w/.test(s));
}

/** Detects article references inside a sentence (or its immediate context). */
function guessLegalBasis(sentence: string): string | undefined {
  const m = sentence.match(ARTICLE_RE);
  if (m) return m[0].replace(/\s+/g, ' ').trim();
  return undefined;
}

/**
 * Suggests testable atoms from raw legal text. Purely offline.
 * Returns sentences that match at least one marker, best-typed and ranked.
 */
export function suggestAtoms(text: string, maxSuggestions = 200): AtomSuggestion[] {
  const sentences = splitSentences(text);
  const seen = new Set<string>();
  const suggestions: AtomSuggestion[] = [];

  for (const sentence of sentences) {
    const key = sentence.toLowerCase().replace(/\s+/g, ' ');
    if (seen.has(key)) continue;
    seen.add(key);

    const hits: Array<{ type: AtomSuggestion['atom_type']; label: string }> = [];
    for (const marker of MARKERS) {
      if (marker.re.test(sentence)) hits.push({ type: marker.type, label: marker.label });
    }
    if (hits.length === 0) continue;

    const types = new Set(hits.map((h) => h.type));
    // A bare "días/meses/años" without digits is too weak; require a number for deadline/number atoms
    const hasNumber = NUMBER_RE.test(sentence);

    // Institutional-competence facts keep their type even when phrased with an
    // exception clause ("El INSS será competente…, salvo que…").
    const isCompetenceSentence =
      types.has('competent_body') &&
      /\b([oó]rgano\s+(?:competente|de\s+gesti[oó]n)|ser[aá]\s+competente|competencia\s+para|gesti[oó]n\s+corresponda?|entidad\s+gestora\s+o\s+(?:colaboradora|competente))\b/i.test(sentence);

    let atomType: AtomSuggestion['atom_type'];
    if (isCompetenceSentence) atomType = 'competent_body';
    else if (types.has('exception')) atomType = 'exception';
    else if (types.has('deadline') && hasNumber) atomType = 'deadline';
    else if (types.has('percentage') && hasNumber) atomType = 'percentage';
    else if (types.has('coefficient')) atomType = 'coefficient';
    else if (types.has('amount')) atomType = 'amount';
    else if (types.has('competent_body')) atomType = 'competent_body';
    else if (types.has('legal_effect')) atomType = 'legal_effect';
    else if (types.has('classification')) atomType = 'classification';
    else if (types.has('procedure')) atomType = 'procedure';
    else if (types.has('condition')) atomType = 'condition';
    else if (types.has('right')) atomType = 'right';
    else if (types.has('duty')) atomType = 'duty';
    else if (types.has('definition')) atomType = 'definition';
    else if (types.has('deadline')) atomType = 'deadline'; // qualitative deadline (no digits) still valid
    else atomType = TYPE_PRIORITY.find((t) => types.has(t)) ?? 'definition';

    // Confidence: distinct marker categories + numeric precision bonus
    const confidence = Math.min(1, 0.4 + 0.2 * hits.length + (hasNumber ? 0.2 : 0));

    suggestions.push({
      text: sentence,
      atom_type: atomType,
      legal_basis: guessLegalBasis(sentence),
      matched_markers: Array.from(new Set(hits.map((h) => h.label))),
      confidence: Number(confidence.toFixed(2)),
    });
    if (suggestions.length >= maxSuggestions) break;
  }

  // Rank: confidence desc, then exception/deadline first as tiebreak
  suggestions.sort((a, b) => b.confidence - a.confidence);
  return suggestions;
}

// ---------------------------------------------------------------------------
// Chunk splitter (spec §8.1: store source chunks with page/article references)
// ---------------------------------------------------------------------------

const MAX_CHUNK_CHARS = 2500;

/**
 * Splits raw text (optionally per-page) into SourceChunk drafts.
 * Split points: page boundaries → "Artículo N" headings → paragraphs when a
 * segment exceeds MAX_CHUNK_CHARS.
 */
export function splitIntoChunks(
  input: string | Array<{ pageNumber: number; text: string }>,
): ChunkDraft[] {
  const segments: Array<{ text: string; page?: number }> = Array.isArray(input)
    ? input.map((p) => ({ text: p.text, page: p.pageNumber }))
    : [{ text: input }];

  const drafts: ChunkDraft[] = [];
  let order = 0;

  for (const seg of segments) {
    // Split on "Artículo N" headings, keeping the heading with its body.
    const articleParts = seg.text
      .split(/(?=^\s*(?:Art[ií]culo|ART[IÍ]CULO)\s+\d+)/m)
      .map((s) => s.trim())
      .filter(Boolean);

    for (const part of articleParts) {
      const heading = part.match(/^\s*((?:Art[ií]culo|ART[IÍ]CULO)\s+\d+[^\n]{0,80})/);
      const articleRef = heading ? heading[1].trim().replace(/\s+/g, ' ') : undefined;

      if (part.length <= MAX_CHUNK_CHARS) {
        drafts.push({
          raw_text: part,
          page_number: seg.page,
          article_reference: articleRef,
          order_index: order++,
        });
        continue;
      }

      // Too long: fall back to paragraph grouping under the same article ref.
      // A single paragraph larger than the cap is hard-split on sentence bounds.
      const paragraphs = part
        .split(/\n\s*\n/)
        .flatMap((p) => {
          const para = p.trim();
          if (!para) return [];
          if (para.length <= MAX_CHUNK_CHARS) return [para];
          const rawSentences = para.split(/(?<=[.;])\s+/);
          const pieces: string[] = [];
          let buf = '';
          for (const s of rawSentences) {
            if (buf && (buf + ' ' + s).length > MAX_CHUNK_CHARS) {
              pieces.push(buf);
              buf = s;
            } else {
              buf = buf ? `${buf} ${s}` : s;
            }
          }
          if (buf) pieces.push(buf);
          return pieces;
        });
      let buffer = '';
      for (const para of paragraphs) {
        if (buffer && (buffer + '\n\n' + para).length > MAX_CHUNK_CHARS) {
          drafts.push({
            raw_text: buffer,
            page_number: seg.page,
            article_reference: articleRef,
            order_index: order++,
          });
          buffer = para;
        } else {
          buffer = buffer ? `${buffer}\n\n${para}` : para;
        }
      }
      if (buffer) {
        drafts.push({ raw_text: buffer, page_number: seg.page, article_reference: articleRef, order_index: order++ });
      }
    }
  }

  return drafts;
}
