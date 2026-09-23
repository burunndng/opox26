export type AtomType =
  | 'definition'
  | 'number'
  | 'deadline'
  | 'amount'
  | 'percentage'
  | 'coefficient'
  | 'condition'
  | 'exception'
  | 'competent_body'
  | 'legal_effect'
  | 'classification'
  | 'procedure'
  | 'right'
  | 'duty';

export type ClusterType =
  | 'numeric'
  | 'conceptual'
  | 'procedural'
  | 'institutional'
  | 'exception'
  | 'classification';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type ItemType =
  | 'cover_and_generate_mcq'
  | 'cloze'
  | 'contrast_card'
  | 'number_sort'
  | 'spot_error'
  | 'two_tier'
  | 'exception_tree'
  | 'fact_variant'
  | 'retrieval_prompt'
  | 'pretest_item';

export type ItemStatus = 'draft' | 'needs_review' | 'validated' | 'active' | 'retired';

export type CognitiveOperation =
  | 'generative_retrieval'
  | 'micro_discrimination'
  | 'response_inhibition'
  | 'exception_detection'
  | 'calibrated_decision'
  | 'numeric_precision'
  | 'institutional_discrimination'
  | 'application';

export type TrapType =
  | 'numeric_substitution'
  | 'partial_rule_accuracy'
  | 'conceptual_merger'
  | 'temporal_confusion'
  | 'wrong_competent_body'
  | 'exception_ignored'
  | 'overbroad_statement'
  | 'hyper_narrow_statement'
  | 'factual_misapplication'
  | 'true_but_irrelevant'
  | 'familiar_wording_trap'
  | 'absolute_relative_confusion'
  | 'rule_exception_swap'
  | 'wrong_start_date'
  | 'wrong_legal_object'
  | 'numeric_precision';

export type ErrorTypeCode =
  | 'E1'  // Did not know rule
  | 'E2'  // Knew but forgot under pressure
  | 'E3'  // Misread stem
  | 'E4'  // Missed exception/qualifier
  | 'E5'  // Confused two concepts
  | 'E6'  // Wrong number/deadline/amount
  | 'E7'  // Guessed correctly (lucky recognition)
  | 'E8'  // Confidently wrong
  | 'E9'  // Careless selection
  | 'E10' // Time pressure
  | 'E11' // Fell for familiar wording
  | 'E12' // Changed answer without justification
  | 'E13' // Generated answer wrong but selected correct option
  | 'E14' // Generated answer correct but selected wrong option
  | 'E15' // Wrong legal object
  | 'E16' // Wrong start date
  | 'E17' // Wrong competent body
  | 'E18' // Overbroad statement
  | 'E19' // Hyper-narrow statement
  | 'E20';// True but irrelevant

export interface Topic {
  id: string;
  name: string;
  description: string;
  source_file?: string;
  status: 'draft' | 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

/**
 * Full in-memory database shape persisted to SQLite (data/oposilab.db).
 * Moved here from server/db.ts so both the server and the persistence layer
 * (and tests) can share it without circular imports.
 */
export interface DatabaseSchema {
  version: number;
  settings: AppSettings;
  topics: Topic[];
  sourceChunks: SourceChunk[];
  atoms: Atom[];
  clusters: Cluster[];
  confusionPairs: ConfusionPair[];
  items: Item[];
  activityAttempts: ActivityAttempt[];
  reviewSchedules: ReviewSchedule[];
  errorLogs: ErrorLog[];
  sessions: Session[];
  savedSessionState?: any;
}

export interface SourceChunk {
  id: string;
  topic_id: string;
  page_number?: number;
  article_reference?: string;
  raw_text: string;
  summary?: string;
  order_index: number;
}

export interface Atom {
  id: string;
  topic_id?: string;
  source_chunk_id?: string;
  text: string;
  atom_type?: AtomType;
  type?: AtomType;
  legal_basis?: string;
  legal?: string;
  cluster_id?: string;
  cluster?: string;
  confusion_pair_id?: string;
  pair?: string;
  tags?: string[];
  difficulty?: number; // 1-5
  diff?: number;
  figure_status?: 'BOE_VERIFIED' | 'ESTIMATED_LPGE';
  status?: 'draft' | 'validated' | 'deprecated';
  created_at?: string;
  updated_at?: string;
}

export interface Cluster {
  id: string;
  topic_id?: string;
  name: string;
  description: string;
  type: ClusterType;
  priority: Priority;
}

export interface ConfusionPair {
  id: string;
  topic_id?: string;
  concept_a: string;
  concept_b: string;
  discriminating_cue: string;
  common_trap: string;
  legal_basis_a: string;
  legal_basis_b: string;
  example_case?: string;
  status: 'draft' | 'validated';
  severity: Priority;
}

export interface MCQOption {
  id: string;
  text: string;
  is_correct: boolean;
  trap_type?: TrapType;
  explanation?: string;
  condition_if_correct?: string;
}

export interface NumberSortItem {
  id: string;
  concept: string;
  correct_value: string;
  bucket?: string;
  category?: string;
}

export interface SpotErrorData {
  statement?: string;
  full_statement?: string;
  erroneous_span?: string;
  corrected_text?: string;
  explanation?: string;
  trap_type?: TrapType;
  error_spans?: Array<{
    id?: string;
    text: string;
    correction: string;
    explanation: string;
    trap_type: TrapType;
    is_error?: boolean;
  }>;
}

export type ConfidenceLevel = 0 | 1 | 2 | 3;

export interface TwoTierData {
  tier1_question?: string;
  tier1_options?: Array<{ id: string; text: string; is_correct: boolean }>;
  tier2_prompt?: string;
  tier2_question?: string;
  tier2_options?: Array<{ id: string; text: string; is_correct: boolean; explanation?: string }>;
  correct_tier2_answer?: string;
  tier1?: {
    prompt: string;
    options: Array<{ id: string; text: string; is_correct: boolean }>;
  };
  tier2?: {
    prompt: string;
    options: Array<{ id: string; text: string; is_correct: boolean; explanation?: string }>;
  };
}

export interface ExceptionTreeNode {
  id: string;
  label: string;
  rule_text: string;
  legal_basis: string;
  is_exception?: boolean;
  children?: ExceptionTreeNode[];
}

export interface ExceptionTreeData {
  root_node?: ExceptionTreeNode;
  root_rule?: ExceptionTreeNode;
  test_cases: Array<{
    scenario: string;
    correct_leaf_id: string;
    explanation: string;
  }>;
}

export interface FactVariantCase {
  base_scenario?: string;
  base_outcome?: string;
  base_legal_basis?: string;
  base_case?: {
    scenario: string;
    question?: string;
    correct_outcome: string;
    legal_rule?: string;
  };
  variants: Array<{
    id: string;
    changed_fact: string;
    expected_outcome?: string;
    correct_outcome?: string;
    outcome_changes: boolean;
    explanation: string;
    legal_basis?: string;
    new_scenario?: string;
  }>;
}

export interface NumberSortData {
  title?: string;
  instruction?: string;
  items: NumberSortItem[];
  available_buckets?: string[];
}

export interface Item {
  id: string;
  topic_id: string;
  cluster_id?: string;
  confusion_pair_id?: string;
  item_type: ItemType;
  stem: string;
  prompt_before_options?: string;
  options?: MCQOption[];
  correct_answer?: string;
  legal_basis: string;
  rule_statement: string;
  why_correct: string;
  distractor_analysis?: Record<string, string>;
  trap_types?: Record<string, TrapType> | TrapType[];
  corrective_rule: string;
  condition_if_distractor_correct?: Record<string, string>;
  difficulty: number;
  cognitive_operations: CognitiveOperation[];
  status: ItemStatus;
  source: 'manual' | 'ai_draft' | 'imported';
  // Optional polymorphic structures
  cloze_data?: {
    text_with_clozes?: string; // e.g. "Prescribe a los {{c1::5 años}} contados desde el {{c2::hecho causante}}"
    template_text?: string;
    target_answer?: string;
    blanks?: Array<{ id?: string; index?: number; target?: string; answer?: string; correct_answer?: string; prompt_hint?: string; explanation?: string; trap_type_if_missed?: TrapType; synonyms?: string[] }>;
    synonyms?: Record<string, string[]> | string[];
    near_misses?: Record<string, { trigger: string; feedback: string }>;
  };
  contrast_data?: {
    concept_a: string;
    concept_b: string;
    prompt_cue?: string;
    distinguishing_criteria?: string;
    comparison_fields?: Array<{ label?: string; criterion?: string; value_a?: string; value_b?: string; concept_a_val?: string; concept_b_val?: string; trap_note?: string }>;
    matrix_rows?: Array<{ criterion?: string; label?: string; value_a?: string; value_b?: string; concept_a_val?: string; concept_b_val?: string; trap_note?: string }>;
    rows?: Array<{ criterion?: string; label?: string; value_a?: string; value_b?: string; concept_a_val?: string; concept_b_val?: string; trap_note?: string }>;
    mini_case?: string;
    mini_case_answer?: string;
  };
  number_sort_data?: NumberSortData;
  spot_error_data?: SpotErrorData;
  two_tier_data?: TwoTierData;
  exception_tree_data?: ExceptionTreeData;
  fact_variant_data?: FactVariantCase;
  fsrs_info?: ItemFsrsInfo;
  figure_status?: 'BOE_VERIFIED' | 'ESTIMATED_LPGE';
  created_at: string;
  updated_at: string;
}

export interface ItemFsrsInfo {
  stability?: number;
  difficulty?: number;
  retrievability?: number; // 0-100%
  days_overdue?: number;
  lapses?: number;
  state?: string;
  selection_reason_badge?: string;
  selection_reason_detail?: string;
}

export interface ActivityAttempt {
  id: string;
  item_id: string;
  session_id?: string;
  activity_type: ItemType;
  user_response?: string;
  generated_answer_before_options?: string;
  selected_option?: string;
  reasoning_response?: string;
  confidence: 0 | 1 | 2 | 3; // 0=puro azar, 1=débil, 2=probablemente, 3=seguro
  correct: boolean;
  used_hint?: boolean;
  hints_revealed?: number | string[];
  error_type_code?: ErrorTypeCode | string;
  trap_selected_by_user?: TrapType;
  time_to_generate_ms?: number;
  time_to_answer_ms?: number;
  was_interleaved?: boolean;
  was_timed?: boolean;
  format_version?: number;
  created_at: string;
}

export type BaremoPenalty = 0 | 0.25 | 0.333 | 0.5;

export interface BaremoConfig {
  id: string;
  label: string;
  shortLabel: string;
  penaltyPerError: number; // e.g. 0.333, 0.25, 0.5, 0
  formulaDescription: string;
}

export const BAREMOS: BaremoConfig[] = [
  {
    id: 'quarter',
    label: 'Oficial Seguridad Social C1 (1/4: -0,25 pts)',
    shortLabel: '-0,25 pts (SS C1)',
    penaltyPerError: 0.25,
    formulaDescription: '4 fallos anulan 1 acierto (+1,00 / -0,25). La omisión puntúa 0.',
  },
  {
    id: 'age_third',
    label: 'Oficial AGE General (1/3: -0,33 pts)',
    shortLabel: '-0,33 pts (1/3)',
    penaltyPerError: 0.333,
    formulaDescription: '3 fallos anulan 1 acierto. La omisión puntúa 0.',
  },
  {
    id: 'half',
    label: 'Penalización Rigurosa (1/2: -0,50 pts)',
    shortLabel: '-0,50 pts (1/2)',
    penaltyPerError: 0.5,
    formulaDescription: '2 fallos anulan 1 acierto. La omisión puntúa 0.',
  },
  {
    id: 'none',
    label: 'Formativo (Sin penalización: 0 pts)',
    shortLabel: 'Sin penalizar (0 pts)',
    penaltyPerError: 0,
    formulaDescription: 'Solo suman los aciertos. Los fallos puntúan 0.',
  },
];

export type ItemStudyLifecycleState =
  | 'new_unseen'
  | 'modo_a_in_progress'
  | 'modo_a_passed'
  | 'modo_b_active'
  | 'failed_in_modo_b'
  | 'needs_remediation';

export interface SavedSessionState {
  version: number;
  id: string;
  saved_at: string;
  mode: 'srs' | 'interleaved' | 'activity_specific' | 'pretest' | 'repair' | 'sniper';
  title: string;
  currentIndex: number;
  items: Item[];
  baremoPenalty?: number;
  sessionResults: {
    correct: number;
    errors?: number;
    blanks?: number;
    total: number;
    confidences: number[];
  };
  phase?: 'modo_a_batch' | 'batch_transition' | 'modo_b_batch';
  modoAQueue?: Item[];
  modoAIndex?: number;
  itemLifecycles?: Record<string, ItemStudyLifecycleState>;
}

export interface ReviewSchedule {
  id: string;
  item_id: string;
  state: 'new' | 'learning' | 'review' | 'graduated' | 'maintenance' | 'suspended';
  due_date: string; // ISO string
  interval_days: number;
  ease_factor: number;
  stability: number;
  difficulty: number;
  lapses: number;
  consecutive_correct_sessions: number;
  formats_completed: ItemType[];
  last_confidence?: 0 | 1 | 2 | 3;
  last_error_type?: ErrorTypeCode | string;
  priority_score: number;
  graduated_at?: string;
  suspended_reason?: string;
}

export interface ErrorLog {
  id: string;
  attempt_id: string;
  item_id: string;
  topic_id: string;
  cluster_id?: string;
  confusion_pair_id?: string;
  error_type_code: ErrorTypeCode | string;
  confidence: 0 | 1 | 2 | 3;
  user_explanation?: string;
  corrective_rule: string;
  legal_basis: string;
  trap_type?: TrapType;
  status: 'open' | 'repairing' | 'repaired' | 'mastered' | 'graduated';
  next_review_date: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  name: string;
  type:
    | 'pretest'
    | 'micro_lesson'
    | 'cover_generate'
    | 'cloze'
    | 'contrast'
    | 'number_sort'
    | 'spot_error'
    | 'two_tier'
    | 'exception_tree'
    | 'fact_variant'
    | 'interleaved_block'
    | 'repair_session'
    | 'drill_sniper'
    | 'maintenance';
  started_at: string;
  ended_at?: string;
  item_count: number;
  accuracy?: number;
  avg_confidence?: number;
  calibration_delta?: number;
  notes?: string;
}

export interface AppSettings {
  ai_provider: 'gemini' | 'opencode' | 'openrouter' | 'none';
  ai_model: string;
  default_language: string;
  srs_algorithm: 'successive_relearning' | 'sm2' | 'fsrs';
  graduating_interval: number; // in days
  max_new_items_per_day: number;
  confidence_required_for_graduation: number;
  require_two_formats_for_graduation: boolean;
  require_interleaved_success_for_graduation: boolean;
  jev_enabled?: boolean;
  /** Accessibility: stronger contrast theme (spec §14) */
  high_contrast?: boolean;
}

export type JevPrimitiveType = 'choice' | 'noul' | 'score';

export interface JevQuestionChoice {
  type: 'choice';
  prompt: string;
  options: string[];
}

export interface JevQuestionNoul {
  type: 'noul';
  prompt: string;
}

export interface JevQuestionScore {
  type: 'score';
  prompt: string;
  levels?: string[];
}

export type JevQuestion = JevQuestionChoice | JevQuestionNoul | JevQuestionScore;

export interface JevChoiceAnswer {
  choice: string;
  probabilities: Record<string, number>;
  confidence: number;
}

export interface JevNoulAnswer {
  probability: number;
}

export interface JevScoreAnswer {
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
}

export type JevAnswer = JevChoiceAnswer | JevNoulAnswer | JevScoreAnswer;

export interface JevDecisionResponse {
  model: string;
  answers: Record<string, JevAnswer>;
  usage?: {
    cost?: number;
    input_tokens?: number;
    output_tokens?: number;
  };
  latency_ms: number;
  is_mock?: boolean;
}

export interface JevItemAuditResult {
  is_stem_unambiguous: JevNoulAnswer;
  is_correct_answer_verified: JevNoulAnswer;
  has_double_key_risk: JevNoulAnswer;
  primary_cognitive_trap: JevChoiceAnswer;
  psychometric_difficulty: JevScoreAnswer;
  graduation_readiness: JevNoulAnswer;
  latency_ms: number;
  is_mock?: boolean;
}

export interface JevAttemptDiagnosisResult {
  error_classification: JevChoiceAnswer;
  generative_retrieval_matched: JevNoulAnswer;
  misconception_severity: JevScoreAnswer;
  recommended_repair_action: JevChoiceAnswer;
  latency_ms: number;
  is_mock?: boolean;
}

export interface JevAtomClassificationResult {
  cluster_assignment: JevChoiceAnswer;
  atom_type_refinement: JevChoiceAnswer;
  has_high_interference_risk: JevNoulAnswer;
  exam_criticality: JevScoreAnswer;
  latency_ms: number;
  is_mock?: boolean;
}

export interface JevCascadeVerificationResult {
  is_factually_sound: JevNoulAnswer;
  legal_basis_accurate: JevNoulAnswer;
  distractors_plausible: JevNoulAnswer;
  recommended_action: JevChoiceAnswer;
  confidence: number;
  latency_ms: number;
  is_mock?: boolean;
}

export interface OpenCodeSystemOneQuestion {
  type: 'noul' | 'choice' | 'score';
  instructions: string;
  criteria?: Record<string, string> | string[];
}

export interface OpenCodeSystemOneResponse {
  model: string;
  answers: Record<string, any>;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
  error?: any;
}

export type QualityRuleType =
  | 'legal_basis_required'
  | 'options_count'
  | 'distractor_explanation_missing'
  | 'distractor_trap_type_missing'
  | 'answer_in_stem'
  | 'overloaded_concepts'
  | 'longest_option_bias'
  | 'absolute_wording'
  | 'negative_stem_unhighlighted'
  | 'distractor_condition_missing';

export interface QualityWarning {
  item_id: string;
  severity: 'warning' | 'critical' | 'info';
  rule: QualityRuleType | string;
  message: string;
  pedagogical_rationale?: string;
  remediation?: string;
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'md' | 'txt' | 'csv' | 'json';
  size: number;
  mimeType: string;
  data?: string; // base64 string for PDF
  textContent?: string; // extracted text for markdown/text
}

export interface GroundingCitation {
  url: string;
  title: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
  attachments?: ChatAttachment[];
  citations?: GroundingCitation[];
  searchQueries?: string[];
  modelUsed?: string;
  extractedItems?: Partial<Item>[];
  extractedAtoms?: Partial<Atom>[];
  error?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  model: string;
  enableWebSearch: boolean;
  systemInstruction?: string;
}

