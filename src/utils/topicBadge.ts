import type { Topic } from '../types';

/**
 * Subject / block labels for topic cards.
 *
 * Oposilab mixes "bloque general" temario with "bloque especifico" material, and
 * the two must never look alike in the UI: a candidate has to be able to tell at
 * a glance whether they are drilling general syllabus or the tema especifico.
 *
 * Labels are derived from the topic id (the only field guaranteed to be stable
 * across seeds), never from the display name, so renaming a topic never silently
 * drops its block marker. Unknown topics fall back to the generic label rather
 * than throwing.
 */
const TOPIC_BADGES: Array<{ match: string; subject: string; block?: 'Especifico' }> = [
  { match: 'seguridad_social_tema_3', subject: 'Seguridad Social', block: 'Especifico' },
  { match: 'seguridad_social_tema_8', subject: 'Seguridad Social', block: 'Especifico' },
  { match: 'seguridad_social_tema_7', subject: 'Seguridad Social' },
  { match: 'constitucion_tema_1', subject: 'Derecho Constitucional' },
];

export interface TopicBadge {
  /** Materia, e.g. "Seguridad Social". */
  subject: string;
  /** "Especifico" when the topic is bloque especifico, otherwise undefined. */
  block?: 'Especifico';
  /** Full label for display, e.g. "Seguridad Social · Especifico". */
  label: string;
  /** Compact marker for tight spaces, e.g. "ES". Empty for general material. */
  marker: string;
}

export function getTopicBadge(topic: Pick<Topic, 'id'> | null | undefined): TopicBadge {
  const id = topic?.id ?? '';
  const hit = TOPIC_BADGES.find((entry) => id.includes(entry.match));

  const subject = hit?.subject ?? 'Temario';
  const block = hit?.block;

  return {
    subject,
    block,
    label: block ? `${subject} · ${block}` : subject,
    marker: block === 'Especifico' ? 'ES' : '',
  };
}