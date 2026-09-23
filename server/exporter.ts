import { db } from './db.ts';
import { Item, ErrorLog } from '../src/types.ts';

export class DataExporter {
  public static exportFullJson(): string {
    return JSON.stringify(db.getAllData(), null, 2);
  }

  public static exportItemsCsv(topicId?: string): string {
    const items = db.getItems(topicId ? { topic_id: topicId } : undefined);
    const headers = ['ID', 'Tipo', 'Pregunta/Enunciado', 'Respuesta Correcta', 'Base Legal', 'Regla Correctiva', 'Dificultad', 'Estado'];
    
    const rows = items.map((i) => [
      i.id,
      i.item_type,
      `"${(i.stem || '').replace(/"/g, '""')}"`,
      `"${(i.correct_answer || '').replace(/"/g, '""')}"`,
      `"${(i.legal_basis || '').replace(/"/g, '""')}"`,
      `"${(i.corrective_rule || '').replace(/"/g, '""')}"`,
      i.difficulty,
      i.status,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  public static exportErrorsCsv(): string {
    const errors = db.getErrorLogs();
    const headers = ['ID', 'Item ID', 'Código Error', 'Confianza', 'Base Legal', 'Regla Correctiva', 'Tipo Trampa', 'Estado', 'Fecha'];
    const rows = errors.map((e) => [
      e.id,
      e.item_id,
      e.error_type_code,
      e.confidence,
      `"${(e.legal_basis || '').replace(/"/g, '""')}"`,
      `"${(e.corrective_rule || '').replace(/"/g, '""')}"`,
      e.trap_type || '',
      e.status,
      e.created_at,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Generates Anki-compatible TSV files with tags and formatted HTML cards.
   */
  public static exportAnkiTsv(topicId?: string): {
    mcqTsv: string;
    clozeTsv: string;
    contrastTsv: string;
    numberSortTsv: string;
    spotErrorTsv: string;
  } {
    const items = db.getItems(topicId ? { topic_id: topicId } : undefined);

    // 1. MCQ
    const mcqRows: string[] = [];
    const mcqItems = items.filter((i) => i.item_type === 'cover_and_generate_mcq');
    for (const item of mcqItems) {
      const optionsText = (item.options || [])
        .map((o) => `${o.id}) ${o.text}`)
        .join('<br>');
      const distractors = (item.options || [])
        .filter((o) => !o.is_correct)
        .map((o) => `<b>${o.id}</b> [${o.trap_type || 'distractor'}]: ${o.explanation}`)
        .join('<br>');

      const fields = [
        item.stem.replace(/\t/g, ' '),
        (item.prompt_before_options || '').replace(/\t/g, ' '),
        optionsText,
        item.correct_answer,
        item.legal_basis,
        item.why_correct,
        distractors,
        item.corrective_rule,
        item.cluster_id || '',
        item.confusion_pair_id || '',
      ];
      mcqRows.push(fields.join('\t'));
    }

    // 2. Cloze
    const clozeRows: string[] = [];
    const clozeItems = items.filter((i) => i.item_type === 'cloze');
    for (const item of clozeItems) {
      const clozeText = item.cloze_data?.text_with_clozes || item.stem;
      const fields = [
        clozeText.replace(/\t/g, ' '),
        item.legal_basis,
        item.cluster_id || '',
        item.confusion_pair_id || '',
        item.corrective_rule,
      ];
      clozeRows.push(fields.join('\t'));
    }

    // 3. Contrast Card
    const contrastRows: string[] = [];
    const contrastItems = items.filter((i) => i.item_type === 'contrast_card');
    for (const item of contrastItems) {
      const c = item.contrast_data;
      const matrixTable = (c?.comparison_fields || [])
        .map((f) => `<b>${f.label}</b>: ${f.value_a} vs ${f.value_b}`)
        .join('<br>');
      const fields = [
        c?.concept_a || '',
        c?.concept_b || '',
        matrixTable,
        c?.mini_case || '',
        c?.mini_case_answer || '',
        item.legal_basis,
      ];
      contrastRows.push(fields.join('\t'));
    }

    // 4. Number Sort
    const numRows: string[] = [];
    const numItems = items.filter((i) => i.item_type === 'number_sort');
    for (const item of numItems) {
      const pairs = (item.number_sort_data?.items || [])
        .map((p) => `${p.concept} ➔ ${p.correct_value}`)
        .join('<br>');
      const fields = [
        item.stem,
        pairs,
        item.legal_basis,
        item.cluster_id || '',
      ];
      numRows.push(fields.join('\t'));
    }

    // 5. Spot the error
    const spotRows: string[] = [];
    const spotItems = items.filter((i) => i.item_type === 'spot_error');
    for (const item of spotItems) {
      const corrections = (item.spot_error_data?.error_spans || [])
        .map((e) => `Err: "${e.text}" ➔ Corregido: "${e.correction}" (${e.explanation})`)
        .join('<br>');
      const fields = [
        item.spot_error_data?.statement || item.stem,
        corrections,
        item.legal_basis,
        item.corrective_rule,
      ];
      spotRows.push(fields.join('\t'));
    }

    return {
      mcqTsv: mcqRows.join('\n'),
      clozeTsv: clozeRows.join('\n'),
      contrastTsv: contrastRows.join('\n'),
      numberSortTsv: numRows.join('\n'),
      spotErrorTsv: spotRows.join('\n'),
    };
  }

  public static exportQuizletPlainText(topicId?: string): string {
    const items = db.getItems(topicId ? { topic_id: topicId } : undefined);
    return items
      .map((i) => `${i.stem.replace(/[\r\n\t]/g, ' ')}\t${(i.rule_statement || i.correct_answer || '').replace(/[\r\n\t]/g, ' ')} (${i.legal_basis})`)
      .join('\n');
  }

  public static exportAnalyticsMarkdown(): string {
    const items = db.getItems();
    const attempts = db.getAttempts();
    const errors = db.getErrorLogs();
    const clusters = db.getClusters();

    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter((a) => a.correct).length;
    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    let md = `# OposiLab MCQ Trainer - Informe de Rendimiento y Calibración\n\n`;
    md += `- **Fecha del informe**: ${new Date().toLocaleDateString('es-ES')}\n`;
    md += `- **Total de ítems en banco**: ${items.length}\n`;
    md += `- **Intentos totales de práctica**: ${totalAttempts}\n`;
    md += `- **Tasa global de acierto**: ${accuracy}%\n`;
    md += `- **Errores activos**: ${errors.filter((e) => e.status === 'open').length}\n`;
    md += `- **Errores "Confident-Wrong" (alta confianza + fallo)**: ${errors.filter((e) => e.confidence === 3).length}\n\n`;

    md += `## Distribución de Ítems por Tipo\n\n`;
    const typeCounts: Record<string, number> = {};
    for (const i of items) {
      typeCounts[i.item_type] = (typeCounts[i.item_type] || 0) + 1;
    }
    for (const [t, count] of Object.entries(typeCounts)) {
      md += `- **${t}**: ${count} ítems\n`;
    }

    md += `\n## Resumen de Clusters Clave\n\n`;
    for (const c of clusters) {
      const cItems = items.filter((i) => i.cluster_id === c.id);
      md += `- **${c.name}** (${c.type}, prioridad: ${c.priority}): ${cItems.length} ítems\n`;
    }

    return md;
  }
}
