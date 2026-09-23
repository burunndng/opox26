import type { AppSettings } from '../../src/types.ts';

/** Default app settings. Single source of truth (imported by db.ts and persist.ts). */
export const defaultSettings: AppSettings = {
  ai_provider: 'gemini',
  ai_model: 'gemini-3.8-flash',
  default_language: 'es',
  srs_algorithm: 'successive_relearning',
  graduating_interval: 21, // days
  max_new_items_per_day: 15,
  confidence_required_for_graduation: 2,
  require_two_formats_for_graduation: true,
  require_interleaved_success_for_graduation: true,
};
