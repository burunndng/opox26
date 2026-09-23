import { z } from 'zod';

/**
 * Zod input schemas for the Express API (spec §6).
 *
 * Design rules:
 *  - `.passthrough()` everywhere: handlers spread `...body`, so custom/extra
 *    fields (e.g. figure_status, UI-only keys) must survive validation.
 *  - Only core identity fields are *required*; everything else is optional but
 *    type-checked. Deep pedagogical completeness is the job of the
 *    QualityWarning engine, not of input validation.
 */

const idLike = z.string().min(1).max(200);
const optionalId = idLike.optional();
const nonEmptyText = z.string().min(1).max(20000);

export const topicInput = z
  .object({
    id: optionalId,
    name: z.string().min(1).max(300),
    description: z.string().max(10000).optional(),
    source_file: z.string().max(500).optional(),
    status: z.enum(['draft', 'active', 'archived']).optional(),
  })
  .passthrough();

export const sourceChunkInput = z
  .object({
    id: optionalId,
    topic_id: optionalId,
    page_number: z.number().int().nonnegative().optional(),
    article_reference: z.string().max(300).optional(),
    raw_text: nonEmptyText,
    summary: z.string().max(10000).optional(),
    order_index: z.number().int().optional(),
  })
  .passthrough();

export const atomInput = z
  .object({
    id: optionalId,
    topic_id: optionalId,
    source_chunk_id: optionalId,
    text: nonEmptyText,
    atom_type: z.string().max(60).optional(),
    legal_basis: z.string().max(500).optional(),
    cluster_id: optionalId,
    confusion_pair_id: optionalId,
    tags: z.array(z.string().max(100)).max(50).optional(),
    difficulty: z.number().int().min(1).max(5).optional(),
    figure_status: z.enum(['BOE_VERIFIED', 'ESTIMATED_LPGE']).optional(),
    status: z.enum(['draft', 'validated', 'deprecated']).optional(),
  })
  .passthrough();

export const clusterInput = z
  .object({
    id: optionalId,
    topic_id: optionalId,
    name: z.string().min(1).max(300),
    description: z.string().max(10000).optional(),
    type: z.enum(['numeric', 'conceptual', 'procedural', 'institutional', 'exception', 'classification']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  })
  .passthrough();

export const confusionPairInput = z
  .object({
    id: optionalId,
    topic_id: optionalId,
    concept_a: z.string().min(1).max(300),
    concept_b: z.string().min(1).max(300),
    discriminating_cue: z.string().min(1).max(5000),
    common_trap: z.string().min(1).max(5000),
    legal_basis_a: z.string().max(500).optional(),
    legal_basis_b: z.string().max(500).optional(),
    example_case: z.string().max(20000).optional(),
    status: z.enum(['draft', 'validated']).optional(),
    severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  })
  .passthrough();

const mcqOptionInput = z
  .object({
    id: idLike,
    text: z.string().max(10000),
    is_correct: z.boolean(),
    trap_type: z.string().max(60).optional(),
    explanation: z.string().max(10000).optional(),
    condition_if_correct: z.string().max(10000).optional(),
  })
  .passthrough();

export const itemInput = z
  .object({
    id: optionalId,
    topic_id: idLike,
    cluster_id: optionalId,
    confusion_pair_id: optionalId,
    item_type: z.enum([
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
    ]),
    stem: nonEmptyText,
    options: z.array(mcqOptionInput).min(0).max(8).optional(),
    correct_answer: z.string().max(2000).optional(),
    legal_basis: z.string().max(1000).optional(),
    rule_statement: z.string().max(10000).optional(),
    why_correct: z.string().max(10000).optional(),
    distractor_analysis: z.record(z.string(), z.string().max(10000)).optional(),
    trap_types: z.union([z.record(z.string(), z.string()), z.array(z.string())]).optional(),
    corrective_rule: z.string().max(10000).optional(),
    condition_if_distractor_correct: z.record(z.string(), z.string().max(10000)).optional(),
    difficulty: z.number().int().min(1).max(5).optional(),
    cognitive_operations: z.array(z.string().max(60)).max(10).optional(),
    status: z.enum(['draft', 'needs_review', 'validated', 'active', 'retired']).optional(),
    source: z.enum(['manual', 'ai_draft', 'imported']).optional(),
  })
  .passthrough();

export const attemptInput = z
  .object({
    item_id: idLike,
    session_id: optionalId,
    activity_type: z.string().min(1).max(60),
    user_response: z.string().max(20000).optional(),
    generated_answer_before_options: z.string().max(20000).optional(),
    selected_option: z.string().max(500).optional(),
    reasoning_response: z.string().max(20000).optional(),
    confidence: z.number().int().min(0).max(3),
    correct: z.boolean(),
    used_hint: z.boolean().optional(),
    hints_revealed: z.union([z.number(), z.array(z.number())]).optional(),
    error_type_code: z.string().max(10).optional(),
    trap_selected_by_user: z.string().max(60).optional(),
    time_to_generate_ms: z.number().nonnegative().optional(),
    time_to_answer_ms: z.number().nonnegative().optional(),
    was_interleaved: z.boolean().optional(),
    was_timed: z.boolean().optional(),
    format_version: z.number().int().nonnegative().optional(),
  })
  .passthrough();

export const errorLogUpdateInput = z
  .object({
    user_explanation: z.string().max(20000).optional(),
    error_type_code: z.string().max(10).optional(),
    trap_type: z.string().max(60).optional(),
    status: z.enum(['open', 'repairing', 'repaired', 'mastered', 'graduated']).optional(),
    next_review_date: z.string().max(60).optional(),
    corrective_rule: z.string().max(10000).optional(),
  })
  .passthrough();

export const settingsUpdateInput = z
  .object({
    ai_provider: z.enum(['gemini', 'opencode', 'openrouter', 'none']).optional(),
    ai_model: z.string().max(200).optional(),
    default_language: z.string().max(10).optional(),
    srs_algorithm: z.enum(['successive_relearning', 'sm2', 'fsrs']).optional(),
    graduating_interval: z.number().int().min(1).max(365).optional(),
    max_new_items_per_day: z.number().int().min(1).max(500).optional(),
    confidence_required_for_graduation: z.number().int().min(0).max(3).optional(),
    require_two_formats_for_graduation: z.boolean().optional(),
    require_interleaved_success_for_graduation: z.boolean().optional(),
    jev_enabled: z.boolean().optional(),
    high_contrast: z.boolean().optional(),
  })
  .passthrough();

export const sessionInput = z
  .object({
    name: z.string().min(1).max(300),
    type: z.string().min(1).max(60),
    started_at: z.string().max(60).optional(),
    ended_at: z.string().max(60).optional(),
    item_count: z.number().int().nonnegative().optional(),
    accuracy: z.number().optional(),
    avg_confidence: z.number().optional(),
    calibration_delta: z.number().optional(),
    notes: z.string().max(20000).optional(),
  })
  .passthrough();

// --- Local-first import pipeline (Phase B) ---

export const pdfImportInput = z
  .object({
    filename: z.string().max(500).optional(),
    // Base64-encoded PDF bytes (JSON transport avoids a multipart dependency)
    data_base64: z.string().min(10).max(12_000_000),
  })
  .passthrough();

export const suggestAtomsInput = z
  .object({
    text: z.string().min(1).max(2_000_000),
    max_suggestions: z.number().int().min(1).max(500).optional(),
  })
  .passthrough();

export const chunkSplitInput = z
  .object({
    text: z.string().max(2_000_000).optional(),
    pages: z.array(z.object({ pageNumber: z.number().int().positive(), text: z.string().max(500_000) })).max(5000).optional(),
  })
  .refine((v) => Boolean(v.text || (v.pages && v.pages.length > 0)), {
    message: 'Se requiere "text" o "pages" no vacíos',
  });
