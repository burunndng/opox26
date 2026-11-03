import type { ItemType } from '../types.ts';

/**
 * Compile-time P0 invariant: every ItemType must have a dedicated render block
 * in `src/components/ActivityRunner.tsx`. Adding a member to the ItemType union
 * without registering it here (and implementing its renderer) fails
 * `npm run lint` via the RECORD constraint below plus the exhaustive-check
 * export.
 *
 * Layered guards:
 * - `Record<ItemType, true>` — tsc errors when ItemType gains a member that is
 *   not registered here.
 * - `RUNNER_COVERAGE_CHECK` — explicit Exclude sanity assert, importable at
 *   runtime by tests.
 * - `tests/renderer-coverage.test.ts` — ties each registered type to an actual
 *   `item_type === '<type>'` render condition in ActivityRunner source.
 */
export const RUNNER_RENDERED_ITEM_TYPES = [
  'cover_and_generate_mcq',
  'cloze',
  'contrast_card',
  'number_sort',
  'spot_error',
  'two_tier',
  'exception_tree',
  'fact_variant',
  'retrieval_prompt',
  'pretest_item',
] as const satisfies readonly ItemType[];

const RENDERER_COVERAGE: Record<ItemType, true> = {
  cover_and_generate_mcq: true,
  cloze: true,
  contrast_card: true,
  number_sort: true,
  spot_error: true,
  two_tier: true,
  exception_tree: true,
  fact_variant: true,
  retrieval_prompt: true,
  pretest_item: true,
};

type MissingRenderer = Exclude<ItemType, (typeof RUNNER_RENDERED_ITEM_TYPES)[number]>;

/**
 * Fails to compile when the ItemType union has a member without a renderer:
 * `never extends never` -> true (OK); any missing member -> tuple type, and
 * `true` is not assignable to it.
 */
export const RUNNER_COVERAGE_CHECK: MissingRenderer extends never
  ? true
  : ['missing renderer for', MissingRenderer] = true;

/** Runtime guard used by ActivityRunner's loud unsupported-type fallback. */
export const hasRunnerRenderer = (itemType: ItemType): boolean =>
  itemType in RENDERER_COVERAGE;
