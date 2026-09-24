/** Hash an item/encounter pair into a stable 32-bit seed (FNV-1a). */
export function optionOrderSeed(itemId: string, encounter: number): number {
  const input = `${itemId}#${encounter}`;
  let hash = 0x811c9dc5;

  for (let index = 0; index < input.length; index++) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 0x1_0000_0000;
  };
}

/** Return a deterministic shuffled copy, preserving each option's stable ID. */
export function orderOptions<T extends { id: string }>(options: T[], seed: number): T[] {
  const ordered = [...options];
  const random = mulberry32(seed);

  for (let index = ordered.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    [ordered[index], ordered[swapIndex]] = [ordered[swapIndex], ordered[index]];
  }

  return ordered;
}

/** Resolve a displayed zero-based position to the option's stable ID. */
export function optionIdAtPosition<T extends { id: string }>(
  ordered: T[],
  position: number,
): string | undefined {
  if (!Number.isInteger(position) || position < 0) return undefined;
  return ordered[position]?.id;
}
