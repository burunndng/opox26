import { Atom } from '../types.ts';

/**
 * Retrieval-first micro-lesson matching (spec §9.2).
 * Compares a free-text "regla de memoria" attempt against the key atoms of a
 * chunk using accent-insensitive keyword matching. Pure functions — unit tested.
 */

const STOPWORDS = new Set([
  'sobre', 'entre', 'desde', 'hasta', 'cuando', 'donde', 'quien', 'cual', 'cuales',
  'todas', 'todos', 'sera', 'seran', 'tienen', 'tiene', 'puede', 'pueden', 'debera',
  'aquella', 'aquel', 'misma', 'mismo', 'traves', 'parte', 'partes', 'caso', 'casos',
  'cuenta', 'cuentas', 'forma', 'formas', 'mediante', 'conforme', 'dentro', 'fuera',
  'cada', 'segun', 'salvo', 'excepto', 'notiembre', 'porcentaje', 'numero',
  'articulo', 'disposicion', 'general', 'seguridad', 'social', 'trabajo',
]);

/** Spanish number words → digits so "cinco años" satisfies the "5 años" token. */
const NUMBER_WORDS: Array<[RegExp, string]> = [
  [/\bciento\b/g, '100'],
  [/\bnoventa\b/g, '90'],
  [/\bsetenta\b/g, '70'],
  [/\bsesenta\b/g, '60'],
  [/\bcincuenta\b/g, '50'],
  [/\bcuarenta\b/g, '40'],
  [/\btreinta\b/g, '30'],
  [/\bveinte\b/g, '20'],
  [/\bdiez\b/g, '10'],
  [/\bnueve\b/g, '9'],
  [/\bocho\b/g, '8'],
  [/\bsiete\b/g, '7'],
  [/\bseis\b/g, '6'],
  [/\bcinco\b/g, '5'],
  [/\bcuatro\b/g, '4'],
  [/\btres\b/g, '3'],
  [/\bdos\b/g, '2'],
  [/\buno\b/g, '1'],
  [/\bun\b/g, '1'],
  [/\buna\b/g, '1'],
];

/** Lowercase + accent-fold + number-words→digits + collapse whitespace. */
export function normalizeEs(text: string): string {
  let out = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  for (const [re, digit] of NUMBER_WORDS) {
    out = out.replace(re, digit);
  }
  return out;
}

/** Extracts the discriminative keywords of an atom: number+unit tokens, numbers, and content words. */
export function atomKeywords(atomText: string): string[] {
  const norm = normalizeEs(atomText);
  // Number+unit as ONE token: "5 años" must not be satisfied by "5 meses".
  const unitPairs = norm.match(/\d+(?:[.,]\d+)?\s*(?:anos|meses|dias|veces|por ciento|euros?|iprem)|[12]?\d+(?:[.,]\d+)?\s*%/g) ?? [];
  // Bare numbers only when NOT already covered by a number+unit token, so the
  // discriminative figure stays unique to its unit.
  const numbers = (norm.match(/\d+(?:[.,]\d+)?/g) ?? []).filter(
    (n) => !unitPairs.some((pair) => pair.startsWith(n))
  );
  const words = (norm.match(/[a-zñ]{5,}/g) ?? []).filter((w) => !STOPWORDS.has(w));
  return Array.from(new Set([...unitPairs, ...numbers, ...words]));
}

export interface AtomMatch {
  atomId: string;
  atomText: string;
  matched: string[];
  missed: string[];
  /** Recalled when >=50% of keywords AND every number-ish keyword are present. */
  recalled: boolean;
}

/**
 * Matches every atom against the user's free-text retrieval attempt.
 * An atom counts as recalled when >= 50% of its keywords are present and all
 * of its numeric (or number+unit) keywords appear — numbers are the
 * discriminators in high-interference legal clusters, so a right concept with
 * a wrong figure is NOT a recall.
 */
export function matchAtomsToAnswer(answer: string, atoms: Atom[]): AtomMatch[] {
  const normalizedAnswer = normalizeEs(answer);
  return atoms.map((atom) => {
    const keywords = atomKeywords(atom.text ?? '');
    const numericKeywords = keywords.filter((k) => /\d/.test(k));
    const matched = keywords.filter((k) => normalizedAnswer.includes(k));
    const missed = keywords.filter((k) => !normalizedAnswer.includes(k));
    const allNumbersPresent = numericKeywords.every((k) => matched.includes(k));
    const recalled = keywords.length > 0 && matched.length / keywords.length >= 0.5 && allNumbersPresent;
    return {
      atomId: atom.id,
      atomText: atom.text ?? '',
      matched,
      missed,
      recalled,
    };
  });
}
