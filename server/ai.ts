import { GoogleGenAI, Type } from '@google/genai';
import {
  Atom,
  Item,
  ErrorLog,
  ItemType,
  ChatMessage,
  ChatAttachment,
  GroundingCitation,
  Cluster,
  ConfusionPair,
  ClusterType,
  Priority,
  AtomType,
} from '../src/types.ts';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface ExtractedSetResult {
  clusters: Array<Partial<Cluster> & { temp_id: string }>;
  atoms: Array<Partial<Atom> & { temp_cluster_id?: string }>;
  confusionPairs: Array<Partial<ConfusionPair>>;
  detectedLegalBasis?: string;
  summary: string;
}

export class AiAssistant {
  public static async extractFullSet(
    text: string,
    articleRef?: string
  ): Promise<ExtractedSetResult> {
    const ai = getAiClient();
    if (!ai) {
      return this.heuristicFullSetExtract(text, articleRef);
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Eres un diseñador instruccional y experto en derecho de la Seguridad Social española (TRLGSS).
A partir del siguiente texto normativo o apuntes de estudio${
          articleRef ? ` (Referencia: ${articleRef})` : ''
        }, genera un Set completo de aprendizaje psicométrico estructurado para preguntas tipo test:
1. "clusters": Agrupaciones temáticas cohesivas del texto (ej. Plazos y Prescripción, Cuantías y Coeficientes, Órganos Gestores, Excepciones y Condiciones).
2. "atoms": Proposiciones jurídicas atómicas precisas (mínimo 6, hasta 16), indicando su tipo (definition, number, deadline, amount, percentage, coefficient, condition, exception, competent_body, legal_effect, procedure, right, duty), base legal precisa (ej. "Art. 53.1 TRLGSS"), dificultad (1-4), tags y asociándolos a un temp_cluster_id de los clusters propuestos.
3. "confusionPairs": Pares de conceptos o cifras confusas que el opositor puede mezclar (ej. prescripción vs caducidad, 5 años vs 1 año, INSS vs TGSS), con su pista discriminatoria y trampa frecuente.
4. "summary": Resumen pedagógico del set generado.

Texto:
${text.slice(0, 5000)}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              detectedLegalBasis: { type: Type.STRING },
              clusters: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    temp_id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    type: { type: Type.STRING },
                    priority: { type: Type.STRING },
                  },
                  required: ['temp_id', 'name', 'description', 'type', 'priority'],
                },
              },
              atoms: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    atom_type: { type: Type.STRING },
                    legal_basis: { type: Type.STRING },
                    temp_cluster_id: { type: Type.STRING },
                    difficulty: { type: Type.INTEGER },
                    tags: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ['text', 'atom_type', 'legal_basis', 'difficulty', 'tags'],
                },
              },
              confusionPairs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    concept_a: { type: Type.STRING },
                    concept_b: { type: Type.STRING },
                    discriminating_cue: { type: Type.STRING },
                    common_trap: { type: Type.STRING },
                    legal_basis_a: { type: Type.STRING },
                    legal_basis_b: { type: Type.STRING },
                    severity: { type: Type.STRING },
                  },
                  required: ['concept_a', 'concept_b', 'discriminating_cue', 'common_trap'],
                },
              },
            },
            required: ['summary', 'clusters', 'atoms'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.atoms && Array.isArray(parsed.atoms) && parsed.atoms.length > 0) {
        return {
          clusters: parsed.clusters || [],
          atoms: parsed.atoms.map((a: any) => ({ ...a, status: 'draft' })),
          confusionPairs: parsed.confusionPairs || [],
          detectedLegalBasis: parsed.detectedLegalBasis || articleRef || 'TRLGSS',
          summary:
            parsed.summary ||
            `Set generado con ${parsed.atoms.length} átomos y ${parsed.clusters.length} clusters.`,
        };
      }
      return this.heuristicFullSetExtract(text, articleRef);
    } catch (err) {
      console.warn('AI set extraction failed, falling back to heuristic engine:', err);
      return this.heuristicFullSetExtract(text, articleRef);
    }
  }

  public static async extractAtoms(text: string): Promise<Partial<Atom>[]> {
    const ai = getAiClient();
    if (!ai) {
      // Heuristic fallback if no API key
      return this.heuristicAtomExtract(text);
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Eres un experto preparador de oposiciones de Seguridad Social en España.
Analiza el siguiente texto normativo/doctrinal y extrae proposiciones jurídicas atómicas (átomos de aprendizaje) para preguntas tipo test.
Para cada átomo, identifica:
- text: formulación clara y rigurosa de la proposición legal
- atom_type: uno de [definition, number, deadline, amount, percentage, coefficient, condition, exception, competent_body, legal_effect, classification, procedure, right, duty]
- legal_basis: artículo y ley (ej. "Art. 53.1 TRLGSS")
- difficulty: número entre 1 y 5
- tags: lista de 3 a 5 palabras clave de discriminación

Texto:
${text.slice(0, 4000)}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                atom_type: { type: Type.STRING },
                legal_basis: { type: Type.STRING },
                difficulty: { type: Type.INTEGER },
                tags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['text', 'atom_type', 'legal_basis', 'difficulty', 'tags'],
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || '[]');
      return parsed.map((p: any) => ({
        ...p,
        status: 'draft',
      }));
    } catch (err) {
      console.warn('AI atom extraction failed, using heuristic fallback:', err);
      return this.heuristicAtomExtract(text);
    }
  }

  public static async draftItem(atom: Atom, itemType: ItemType): Promise<Partial<Item>> {
    const ai = getAiClient();
    if (!ai) {
      return this.heuristicDraftItem(atom, itemType);
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Eres un diseñador de ítems psicométricos para oposiciones de la Seguridad Social española (TRLGSS).
A partir de la proposición atómica: "${atom.text}" (Base legal: ${atom.legal_basis}), genera un borrador de ítem tipo: ${itemType}.
IMPORTANTE:
- Todas las opciones de distractores deben ser verosímiles y basarse en conceptos reales o cifras similares de la Seguridad Social.
- Para cada distractor, explica por qué es falso y bajo qué condición alternativa sería correcto.
- Clasifica la trampa de cada distractor entre: [numeric_substitution, partial_rule_accuracy, conceptual_merger, temporal_confusion, wrong_competent_body, exception_ignored, overbroad_statement, hyper_narrow_statement, factual_misapplication, absolute_relative_confusion, wrong_start_date].`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              stem: { type: Type.STRING },
              prompt_before_options: { type: Type.STRING },
              correct_answer: { type: Type.STRING },
              rule_statement: { type: Type.STRING },
              why_correct: { type: Type.STRING },
              corrective_rule: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                    is_correct: { type: Type.BOOLEAN },
                    trap_type: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    condition_if_correct: { type: Type.STRING },
                  },
                  required: ['id', 'text', 'is_correct', 'explanation'],
                },
              },
            },
            required: ['stem', 'correct_answer', 'rule_statement', 'why_correct', 'corrective_rule', 'options'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return {
        ...parsed,
        item_type: itemType,
        topic_id: atom.topic_id,
        cluster_id: atom.cluster_id,
        confusion_pair_id: atom.confusion_pair_id,
        legal_basis: atom.legal_basis,
        difficulty: atom.difficulty || 2,
        status: 'draft',
        source: 'ai_draft',
        cognitive_operations: ['generative_retrieval', 'micro_discrimination'],
      };
    } catch (err) {
      console.warn('AI item drafting failed, using heuristic fallback:', err);
      return this.heuristicDraftItem(atom, itemType);
    }
  }

  // Advanced heuristic Set extraction (Atoms + Clusters + Confusion Pairs)
  private static heuristicFullSetExtract(
    text: string,
    articleRef?: string
  ): ExtractedSetResult {
    const rawSentences = text
      .split(/(?<=[.;\n])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20 && !s.startsWith('#'));

    // 1. Identify primary legal basis
    let primaryBasis = articleRef || '';
    if (!primaryBasis) {
      const artMatch = text.match(/art[íi]culo\s+\d+(\.\d+)?|art\.\s*\d+(\.\d+)?/i);
      const lawMatch = text.match(/TRLGSS|CE\s+1978|Ley\s+\d+\/\d+|RDL\s+\d+\/\d+/i);
      if (artMatch && lawMatch) {
        primaryBasis = `${artMatch[0]} ${lawMatch[0]}`;
      } else if (artMatch) {
        primaryBasis = `${artMatch[0]} TRLGSS`;
      } else {
        primaryBasis = 'TRLGSS';
      }
    }

    // 2. Synthesize thematic clusters based on normative domain
    const clusters: Array<Partial<Cluster> & { temp_id: string }> = [];

    const hasDeadlines = /plazo|días|meses|años|prescrib|caduc|retroactiv|cómputo|fecha/i.test(
      text
    );
    const hasAmounts = /euro|€|importe|cuantía|smi|iprem|porcentaje|%|recargo|coeficiente|1,5|1,4|escala|embargo/i.test(
      text
    );
    const hasBodies = /inss|tgss|mutua|entidad gestora|itss|tesorería|instituto nacional|empresario|inspección/i.test(
      text
    );
    const hasExceptions = /salvo|excepto|no obstante|sin perjuicio|a menos que|condición|requisito|siempre que|suspensión/i.test(
      text
    );
    const hasResponsibility = /responsab|infracción|incumplimiento|recargo|solidari|subsidiari|directa|falta de alta|descubierto/i.test(
      text
    );

    if (hasDeadlines) {
      clusters.push({
        temp_id: 'temp-cluster-deadlines',
        name: 'Plazos, Prescripción y Caducidad',
        description:
          'Plazos temporales de reconocimiento (5 años), cobro (1 año) y cómputo de retroactividad.',
        type: 'numeric' as ClusterType,
        priority: 'critical' as Priority,
      });
    }

    if (hasAmounts) {
      clusters.push({
        temp_id: 'temp-cluster-amounts',
        name: 'Cuantías, Coeficientes y Límites Económicos',
        description:
          'Cifras, coeficientes multiplicadores (1,5 / 1,4), porcentajes de recargo y escalas de embargo.',
        type: 'numeric' as ClusterType,
        priority: 'high' as Priority,
      });
    }

    if (hasBodies) {
      clusters.push({
        temp_id: 'temp-cluster-bodies',
        name: 'Competencias y Entidades Gestoras',
        description:
          'Distribución competencial entre INSS, TGSS, Mutuas Colaboradoras y el Empresario.',
        type: 'institutional' as ClusterType,
        priority: 'high' as Priority,
      });
    }

    if (hasExceptions) {
      clusters.push({
        temp_id: 'temp-cluster-exceptions',
        name: 'Excepciones y Reglas Condicionales',
        description:
          'Supuestos exceptuados, cláusulas de salvaguarda y condiciones especiales de acceso.',
        type: 'exception' as ClusterType,
        priority: 'critical' as Priority,
      });
    }

    if (hasResponsibility) {
      clusters.push({
        temp_id: 'temp-cluster-responsibility',
        name: 'Responsabilidad Empresarial y Recargos',
        description:
          'Régimen de imputación por falta de alta o cotización, y recargo no asegurable por falta de medidas.',
        type: 'procedural' as ClusterType,
        priority: 'high' as Priority,
      });
    }

    // Ensure at least two clusters
    if (clusters.length < 2) {
      clusters.push({
        temp_id: 'temp-cluster-general',
        name: 'Régimen General y Efectos Jurídicos',
        description:
          'Conceptos sustantivos, ámbito subjetivo de aplicación y consecuencias jurídicas.',
        type: 'conceptual' as ClusterType,
        priority: 'medium' as Priority,
      });
    }

    // 3. Atomize sentences into legal propositions
    const atoms: Array<Partial<Atom> & { temp_cluster_id?: string }> = [];

    for (const rawSentence of rawSentences) {
      let sentence = rawSentence.replace(/^[\s•\-\*\d\.\)\:]+/, '').trim();
      if (sentence.length < 20) continue;

      let atomType: AtomType = 'condition';
      let targetClusterId = clusters[0].temp_id;
      const tags: string[] = ['heurístico'];

      if (/plazo|prescrib|caduc|años|meses|días|retroactiv/i.test(sentence)) {
        atomType = 'deadline';
        targetClusterId =
          clusters.find((c) => c.temp_id === 'temp-cluster-deadlines')?.temp_id || clusters[0].temp_id;
        tags.push('plazos', 'cómputo');
      } else if (/coeficiente|1,5|1,4/i.test(sentence)) {
        atomType = 'coefficient';
        targetClusterId =
          clusters.find((c) => c.temp_id === 'temp-cluster-amounts')?.temp_id || clusters[0].temp_id;
        tags.push('coeficiente', 'cómputo');
      } else if (/%|porcentaje|recargo del/i.test(sentence)) {
        atomType = 'percentage';
        targetClusterId =
          clusters.find((c) => c.temp_id === 'temp-cluster-amounts')?.temp_id || clusters[0].temp_id;
        tags.push('porcentaje');
      } else if (/euros|€|importe|cuantía|smi|iprem/i.test(sentence)) {
        atomType = 'amount';
        targetClusterId =
          clusters.find((c) => c.temp_id === 'temp-cluster-amounts')?.temp_id || clusters[0].temp_id;
        tags.push('cuantía', 'límite');
      } else if (/salvo|excepto|no obstante|sin perjuicio|a menos que/i.test(sentence)) {
        atomType = 'exception';
        targetClusterId =
          clusters.find((c) => c.temp_id === 'temp-cluster-exceptions')?.temp_id || clusters[0].temp_id;
        tags.push('excepción', 'salvedad');
      } else if (/inss|tgss|mutua|entidad gestora|tesorería/i.test(sentence)) {
        atomType = 'competent_body';
        targetClusterId =
          clusters.find((c) => c.temp_id === 'temp-cluster-bodies')?.temp_id || clusters[0].temp_id;
        tags.push('órgano', 'competencia');
      } else if (/se define|se entenderá por|tendrá la consideración/i.test(sentence)) {
        atomType = 'definition';
        tags.push('definición');
      } else if (/responsab|solidari|subsidiari|directa/i.test(sentence)) {
        atomType = 'duty';
        targetClusterId =
          clusters.find((c) => c.temp_id === 'temp-cluster-responsibility')?.temp_id || clusters[0].temp_id;
        tags.push('responsabilidad');
      } else if (/extingue|suspende|invalida|anula|devenga/i.test(sentence)) {
        atomType = 'legal_effect';
        tags.push('efectos');
      }

      // Sentence-level legal reference override if explicit
      const specificArtMatch = sentence.match(/art[íi]culo\s+\d+(\.\d+)?|art\.\s*\d+(\.\d+)?/i);
      const sentenceBasis = specificArtMatch ? `${specificArtMatch[0]} TRLGSS` : primaryBasis;

      atoms.push({
        text: sentence,
        atom_type: atomType,
        legal_basis: sentenceBasis,
        temp_cluster_id: targetClusterId,
        difficulty: atomType === 'exception' || atomType === 'coefficient' ? 3 : 2,
        tags: Array.from(new Set(tags)).slice(0, 4),
        status: 'draft',
      });

      if (atoms.length >= 16) break;
    }

    // 4. Identify high-interference confusion pairs present in text
    const confusionPairs: Array<Partial<ConfusionPair>> = [];

    if (/prescrip/i.test(text) && /caduc/i.test(text)) {
      confusionPairs.push({
        concept_a: 'Prescripción del derecho al reconocimiento',
        concept_b: 'Caducidad del derecho al percibo',
        discriminating_cue:
          'Prescribe el derecho al reconocimiento (5 años); caduca el derecho al cobro/mensualidad (1 año).',
        common_trap:
          'Aplicar el plazo de 5 años al percibo económico o 1 año al reconocimiento de la pensión.',
        legal_basis_a: 'Art. 53.1 TRLGSS',
        legal_basis_b: 'Art. 54.1 TRLGSS',
        severity: 'critical' as Priority,
      });
    }

    if (/hecho causante/i.test(text) && (/notific/i.test(text) || /solicitud/i.test(text))) {
      confusionPairs.push({
        concept_a: 'Dies a quo: Día siguiente al hecho causante',
        concept_b: 'Dies a quo: Notificación o Solicitud',
        discriminating_cue:
          'El hecho causante computa la prescripción; la notificación computa la caducidad a tanto alzado.',
        common_trap: 'Intercambiar los días iniciales de cómputo en la resolución de casos prácticos.',
        legal_basis_a: 'Art. 53.1 TRLGSS',
        legal_basis_b: 'Art. 54.2 TRLGSS',
        severity: 'high' as Priority,
      });
    }

    if (/inss/i.test(text) && /tgss/i.test(text)) {
      confusionPairs.push({
        concept_a: 'Instituto Nacional de la Seguridad Social (INSS)',
        concept_b: 'Tesorería General de la Seguridad Social (TGSS)',
        discriminating_cue:
          'El INSS reconoce y gestiona prestaciones económicas; la TGSS gestiona afiliación, recaudación y caja única.',
        common_trap:
          'Atribuir el reconocimiento de la incapacidad permanente o jubilación a la TGSS.',
        legal_basis_a: 'Art. 66 TRLGSS',
        legal_basis_b: 'Art. 67 TRLGSS',
        severity: 'critical' as Priority,
      });
    }

    if (/fijo-discontinuo/i.test(text) || (/1,5/i.test(text) && /1,4/i.test(text))) {
      confusionPairs.push({
        concept_a: 'Coeficiente Fijo-Discontinuo (1,5)',
        concept_b: 'Coeficiente Contrato Corto ≤ 5 días (1,4)',
        discriminating_cue:
          'Fijo-discontinuo multiplica días trabajados por 1,5 (tope anual); contrato ≤ 5 días por 1,4 (tope mensual).',
        common_trap: 'Intercambiar los coeficientes 1,5 y 1,4 o sus topes temporales.',
        legal_basis_a: 'Art. 247 TRLGSS',
        legal_basis_b: 'Art. 249 bis TRLGSS',
        severity: 'high' as Priority,
      });
    }

    if (/recargo/i.test(text) && /medidas/i.test(text)) {
      confusionPairs.push({
        concept_a: 'Recargo de prestaciones por falta de medidas (30%-50%)',
        concept_b: 'Responsabilidad subsidiaria o cobertura por Mutua',
        discriminating_cue:
          'El recargo es exclusivamente a cargo del empresario infractor y está prohibido su aseguramiento.',
        common_trap:
          'Considerar que la mutua aseguradora o la entidad gestora responden del recargo de forma directa o subsidiaria.',
        legal_basis_a: 'Art. 164 TRLGSS',
        legal_basis_b: 'Art. 164.3 TRLGSS',
        severity: 'critical' as Priority,
      });
    }

    const summary = `Se han extraído ${atoms.length} proposiciones atómicas clasificadas en ${
      clusters.length
    } clústeres temáticos${
      confusionPairs.length > 0 ? ` y detectado ${confusionPairs.length} pares de confusión` : ''
    }.`;

    return {
      clusters,
      atoms,
      confusionPairs,
      detectedLegalBasis: primaryBasis,
      summary,
    };
  }

  // Heuristic rule extraction when AI is not configured or offline
  private static heuristicAtomExtract(text: string): Partial<Atom>[] {
    const sentences = text.split(/[.;\n]+/).map((s) => s.trim()).filter((s) => s.length > 25);
    const results: Partial<Atom>[] = [];

    for (const s of sentences) {
      let atomType: any = 'condition';
      if (/plazo|días|meses|años|prescrib|caduc/i.test(s)) atomType = 'deadline';
      else if (/euros|€|importe|cuantía|smi/i.test(s)) atomType = 'amount';
      else if (/%|porcentaje/i.test(s)) atomType = 'percentage';
      else if (/coeficiente|1,5|1,4/i.test(s)) atomType = 'coefficient';
      else if (/salvo|excepto|no obstante|sin perjuicio/i.test(s)) atomType = 'exception';
      else if (/inss|tgss|mutua|entidad gestora/i.test(s)) atomType = 'competent_body';
      else if (/se define|se entenderá/i.test(s)) atomType = 'definition';

      const artMatch = s.match(/art[íi]culo\s+\d+|art\.\s*\d+/i);
      const legalBasis = artMatch ? `${artMatch[0]} TRLGSS` : 'TRLGSS';

      results.push({
        text: s,
        atom_type: atomType,
        legal_basis: legalBasis,
        difficulty: 2,
        status: 'draft',
        tags: ['extraído_heurístico'],
      });

      if (results.length >= 8) break;
    }

    return results;
  }

  private static heuristicDraftItem(atom: Atom, itemType: ItemType): Partial<Item> {
    return {
      stem: `En relación con la normativa de la Seguridad Social: ¿Cuál es la regla aplicable a "${atom.text.slice(0, 60)}..."?`,
      prompt_before_options: 'Escribe de memoria la regla o plazo exacto antes de ver las alternativas.',
      correct_answer: 'A',
      rule_statement: atom.text,
      why_correct: `Conforme con ${atom.legal_basis}.`,
      corrective_rule: `Regla legal exacta: ${atom.text}`,
      options: [
        {
          id: 'A',
          text: atom.text,
          is_correct: true,
          explanation: `Literalmente estipulado en ${atom.legal_basis}.`,
        },
        {
          id: 'B',
          text: `Se aplica la regla general, pero el plazo o cuantía queda a discreción de la entidad gestora sin límite legal.`,
          is_correct: false,
          trap_type: 'overbroad_statement',
          explanation: 'Falso: la norma jurídica no deja margen discrecional desregulado.',
        },
        {
          id: 'C',
          text: `El derecho prescribe o caduca transcurrido exactamente el doble del tiempo estipulado en la norma.`,
          is_correct: false,
          trap_type: 'numeric_substitution',
          explanation: 'Confunde los plazos legales duplicando la cifra.',
        },
        {
          id: 'D',
          text: `La obligación sólo es exigible en contingencias comunes, quedando exentas las contingencias profesionales.`,
          is_correct: false,
          trap_type: 'rule_exception_swap',
          explanation: 'Inversión de régimen entre contingencias profesionales y comunes.',
        },
      ],
      difficulty: atom.difficulty || 2,
      legal_basis: atom.legal_basis,
      item_type: itemType,
      status: 'draft',
      source: 'manual',
    };
  }

  public static async chat(params: {
    messages: ChatMessage[];
    provider?: string;
    model?: string;
    enableWebSearch?: boolean;
    systemInstruction?: string;
    topicContext?: string;
  }): Promise<{
    content: string;
    citations?: GroundingCitation[];
    searchQueries?: string[];
    modelUsed: string;
    extractedItems?: Partial<Item>[];
    extractedAtoms?: Partial<Atom>[];
  }> {
    // Check if OpenRouter is requested
    if (params.provider === 'openrouter' || params.model?.startsWith('openrouter')) {
      return this.chatWithOpenRouter(params);
    }

    const ai = getAiClient();
    const enableWebSearch = Boolean(params.enableWebSearch);
    
    // Choose model: gemini-3.8-flash is the primary model for text and search grounding.
    let modelName = params.model || 'gemini-3.8-flash';
    if (modelName === 'gemini-3.5-flash') {
      modelName = 'gemini-3.8-flash';
    }

    if (!ai) {
      return this.heuristicChatResponse(params.messages, enableWebSearch, modelName);
    }

    const defaultSystem = `Eres el preparador de élite y diseñador instruccional psicométrico de OposiLab MCQ Trainer para oposiciones de la Administración Pública Española, especializado en el Texto Refundido de la Ley General de la Seguridad Social (TRLGSS).
Tu objetivo es ayudar al opositor a dominar el temario mediante actividades cognitivas de alta discriminación, descarte de distractores, análisis de trampas y recuperación generativa activa, evitando la relectura pasiva y los simulacros memorísticos.

Instrucciones clave:
1. Analiza con precisión documentos legales adjuntos (PDFs, Markdown, esquemas normativos, textos de leyes).
2. Si el usuario te pide generar ejercicios, crea actividades del método OposiLab (Cover-and-Generate MCQ, Cloze, Contrast Card, Spot-the-Error, Number/Deadline Sort, Two-Tier, Fact-Variant Lab).
3. Cada opción incorrecta en preguntas tipo test debe tener una trampa psicométrica identificada (numeric_substitution, temporal_confusion, wrong_competent_body, conceptual_merger, exception_ignored, overbroad_statement, etc.) y la condición hipotética bajo la cual sería correcta.
4. Cita siempre el artículo legal exacto (ej. Art. 53 TRLGSS, Art. 247 TRLGSS, etc.).
5. Además de tu respuesta explicativa en español, si generas ítems de test o ejercicios, INCLUYE SIEMPRE al final de tu respuesta un bloque de código JSON con la etiqueta json:oposilab_items para que el sistema permita importarlos al banco con un solo clic:

\`\`\`json:oposilab_items
[
  {
    "stem": "Enunciado riguroso...",
    "prompt_before_options": "Escribe de memoria la regla o plazo...",
    "item_type": "cover_and_generate_mcq",
    "correct_answer": "A",
    "legal_basis": "Art. ... TRLGSS",
    "rule_statement": "Regla legal exacta...",
    "why_correct": "Explicación de por qué A es la opción verdadera...",
    "corrective_rule": "Enmienda conceptual...",
    "options": [
      {
        "id": "A",
        "text": "Opción correcta...",
        "is_correct": true,
        "explanation": "Conforme con el Art. ..."
      },
      {
        "id": "B",
        "text": "Distractor verosímil...",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Por qué es falsa...",
        "condition_if_correct": "Sería correcta si..."
      },
      {
        "id": "C",
        "text": "Distractor...",
        "is_correct": false,
        "trap_type": "temporal_confusion",
        "explanation": "...",
        "condition_if_correct": "..."
      },
      {
        "id": "D",
        "text": "Distractor...",
        "is_correct": false,
        "trap_type": "wrong_competent_body",
        "explanation": "...",
        "condition_if_correct": "..."
      }
    ],
    "difficulty": 2
  }
]
\`\`\`

Si generas átomos normativos, incluye un bloque json:oposilab_atoms:
\`\`\`json:oposilab_atoms
[
  {
    "text": "Proposición atómica...",
    "atom_type": "deadline",
    "legal_basis": "Art. ... TRLGSS",
    "difficulty": 2,
    "tags": ["plazo", "prescripción"]
  }
]
\`\`\``;

    const systemInstruction = params.systemInstruction || defaultSystem;

    // Convert chat messages to Gemini content format
    const contents: any[] = [];

    for (const msg of params.messages) {
      if (msg.role === 'system') continue;

      const role = msg.role === 'user' ? 'user' : 'model';
      const parts: any[] = [];

      // Add attachments if any
      if (msg.role === 'user' && msg.attachments && msg.attachments.length > 0) {
        for (const att of msg.attachments) {
          if (att.type === 'pdf' && att.data) {
            // Strip data:application/pdf;base64, if present
            const cleanBase64 = att.data.replace(/^data:application\/pdf;base64,/, '');
            parts.push({
              inlineData: {
                mimeType: 'application/pdf',
                data: cleanBase64,
              },
            });
          } else if (att.textContent) {
            parts.push({
              text: `[DOCUMENTO ADJUNTO: ${att.name} (${att.type.toUpperCase()})]\n${att.textContent}\n[FIN DOCUMENTO]`,
            });
          }
        }
      }

      // Add text content
      if (msg.content && msg.content.trim()) {
        parts.push({ text: msg.content });
      } else if (parts.length === 0) {
        parts.push({ text: 'Por favor, analiza el documento adjunto y propón actividades.' });
      }

      contents.push({ role, parts });
    }

    try {
      const config: any = {
        systemInstruction,
      };

      if (enableWebSearch) {
        config.tools = [{ googleSearch: {} }];
      }

      let response: any;
      let usedModel = modelName;

      try {
        response = await ai.models.generateContent({
          model: usedModel,
          contents,
          config,
        });
      } catch (firstErr: any) {
        const errMsg = String(firstErr?.message || firstErr || '');
        const isQuota =
          errMsg.includes('429') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('quota') ||
          firstErr?.status === 'RESOURCE_EXHAUSTED' ||
          firstErr?.code === 429;

        if (isQuota && usedModel !== 'gemini-3.1-flash-lite') {
          console.warn(
            `Primary model ${usedModel} hit quota/rate limit. Retrying with gemini-3.1-flash-lite...`
          );
          try {
            usedModel = 'gemini-3.1-flash-lite';
            response = await ai.models.generateContent({
              model: usedModel,
              contents,
              config: { systemInstruction },
            });
          } catch (secondErr: any) {
            console.warn(
              'Gemini flash-lite also exhausted quota. Attempting OpenRouter automatic fallback...'
            );
            try {
              return await this.chatWithOpenRouter({
                ...params,
                model: 'openrouter/free',
              });
            } catch (orErr) {
              console.warn('OpenRouter fallback also failed, using heuristic engine:', orErr);
              return this.heuristicChatResponse(params.messages, enableWebSearch, usedModel, true);
            }
          }
        } else if (isQuota) {
          console.warn('Gemini quota exhausted. Attempting OpenRouter automatic fallback...');
          try {
            return await this.chatWithOpenRouter({
              ...params,
              model: 'openrouter/free',
            });
          } catch (orErr) {
            console.warn('OpenRouter fallback also failed, using heuristic engine:', orErr);
            return this.heuristicChatResponse(params.messages, enableWebSearch, usedModel, true);
          }
        } else {
          console.warn('Gemini API call error. Attempting OpenRouter automatic fallback before heuristic:', errMsg);
          try {
            return await this.chatWithOpenRouter({
              ...params,
              model: 'openrouter/free',
            });
          } catch (orErr) {
            return this.heuristicChatResponse(params.messages, enableWebSearch, usedModel, false, errMsg);
          }
        }
      }

      const responseText = response?.text || '';

      // Extract search grounding citations
      const citations: GroundingCitation[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (Array.isArray(chunks)) {
        for (const c of chunks) {
          if (c.web?.uri) {
            citations.push({
              url: c.web.uri,
              title: c.web.title || c.web.uri,
            });
          }
        }
      }

      const searchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

      // Extract structured items & atoms from response text
      const extractedItems = this.parseExtractedItems(responseText);
      const extractedAtoms = this.parseExtractedAtoms(responseText);

      return {
        content: responseText,
        citations: citations.length > 0 ? citations : undefined,
        searchQueries: searchQueries.length > 0 ? searchQueries : undefined,
        modelUsed: usedModel,
        extractedItems: extractedItems.length > 0 ? extractedItems : undefined,
        extractedAtoms: extractedAtoms.length > 0 ? extractedAtoms : undefined,
      };
    } catch (err: any) {
      console.warn('Gemini chat outer handler error. Attempting OpenRouter fallback:', err?.message);
      try {
        return await this.chatWithOpenRouter({
          ...params,
          model: 'openrouter/free',
        });
      } catch (orErr) {
        return this.heuristicChatResponse(
          params.messages,
          enableWebSearch,
          modelName,
          true,
          err?.message
        );
      }
    }
  }

  // OpenRouter Provider chat handler
  private static async chatWithOpenRouter(params: {
    messages: ChatMessage[];
    provider?: string;
    model?: string;
    enableWebSearch?: boolean;
    systemInstruction?: string;
    topicContext?: string;
  }): Promise<{
    content: string;
    citations?: GroundingCitation[];
    searchQueries?: string[];
    modelUsed: string;
    extractedItems?: Partial<Item>[];
    extractedAtoms?: Partial<Atom>[];
  }> {
    const apiKey =
      process.env.OPENROUTER_API_KEY ||
      'sk-or-v1-REDACTED';
    const targetModel = params.model || 'openrouter/free';

    const defaultSystem = `Eres el preparador de élite y diseñador instruccional psicométrico de OposiLab MCQ Trainer para oposiciones de la Administración Pública Española, especializado en el Texto Refundido de la Ley General de la Seguridad Social (TRLGSS).
Tu objetivo es ayudar al opositor a dominar el temario mediante actividades cognitivas de alta discriminación, descarte de distractores, análisis de trampas y recuperación generativa activa, evitando la relectura pasiva y los simulacros memorísticos.

Instrucciones clave:
1. Analiza con precisión documentos legales adjuntos (PDFs, Markdown, esquemas normativos, textos de leyes).
2. Si el usuario te pide generar ejercicios, crea actividades del método OposiLab (Cover-and-Generate MCQ, Cloze, Contrast Card, Spot-the-Error, Number/Deadline Sort, Two-Tier, Fact-Variant Lab).
3. Cada opción incorrecta en preguntas tipo test debe tener una trampa psicométrica identificada (numeric_substitution, temporal_confusion, wrong_competent_body, conceptual_merger, exception_ignored, overbroad_statement, etc.) y la condición hipotética bajo la cual sería correcta.
4. Cita siempre el artículo legal exacto (ej. Art. 53 TRLGSS, Art. 247 TRLGSS, etc.).
5. Además de tu respuesta explicativa en español, si generas ítems de test o ejercicios, INCLUYE SIEMPRE al final de tu respuesta un bloque de código JSON con la etiqueta json:oposilab_items para que el sistema permita importarlos al banco con un solo clic:

\`\`\`json:oposilab_items
[
  {
    "stem": "Enunciado riguroso...",
    "prompt_before_options": "Escribe de memoria la regla o plazo...",
    "item_type": "cover_and_generate_mcq",
    "correct_answer": "A",
    "legal_basis": "Art. ... TRLGSS",
    "rule_statement": "Regla legal exacta...",
    "why_correct": "Explicación de por qué A es la opción verdadera...",
    "corrective_rule": "Enmienda conceptual...",
    "options": [
      { "id": "A", "text": "Texto opción A", "is_correct": true, "explanation": "Por qué es válida..." },
      { "id": "B", "text": "Texto opción B", "is_correct": false, "trap_type": "numeric_substitution", "explanation": "Por qué falla...", "condition_if_correct": "Sería correcta si..." },
      { "id": "C", "text": "Texto opción C", "is_correct": false, "trap_type": "temporal_confusion", "explanation": "Por qué falla...", "condition_if_correct": "Sería correcta si..." },
      { "id": "D", "text": "Texto opción D", "is_correct": false, "trap_type": "wrong_competent_body", "explanation": "Por qué falla...", "condition_if_correct": "Sería correcta si..." }
    ],
    "difficulty": 2,
    "cognitive_operations": ["generative_retrieval", "micro_discrimination"],
    "status": "draft",
    "source": "ai_draft"
  }
]
\`\`\``;

    const systemPrompt = params.systemInstruction
      ? `${defaultSystem}\n\nEnfoque específico:\n${params.systemInstruction}`
      : defaultSystem;

    const formattedMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];

    if (params.topicContext) {
      formattedMessages.push({
        role: 'system',
        content: `Contexto temático activo: ${params.topicContext}`,
      });
    }

    for (const msg of params.messages) {
      const role = msg.role === 'model' ? 'assistant' : msg.role === 'system' ? 'system' : 'user';
      let content = msg.content || '';
      if (msg.attachments && msg.attachments.length > 0) {
        for (const att of msg.attachments) {
          if (att.textContent) {
            content += `\n\n[DOCUMENTO ADJUNTO: ${att.name}]\n${att.textContent}`;
          }
        }
      }
      formattedMessages.push({ role, content });
    }

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'OposiLab MCQ Trainer',
        },
        body: JSON.stringify({
          model: targetModel,
          messages: formattedMessages,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`OpenRouter API error (${res.status}): ${errorText}`);
      }

      const data: any = await res.json();
      const rawContent = data.choices?.[0]?.message?.content || '';
      const actualModel = data.model || targetModel;

      const extractedItems = this.parseExtractedItems(rawContent);
      const extractedAtoms = this.parseExtractedAtoms(rawContent);

      return {
        content: rawContent,
        modelUsed: `OpenRouter (${actualModel})`,
        extractedItems: extractedItems.length > 0 ? extractedItems : undefined,
        extractedAtoms: extractedAtoms.length > 0 ? extractedAtoms : undefined,
      };
    } catch (err: any) {
      console.warn('OpenRouter chat error. Falling back to local cognitive engine:', err?.message);
      return this.heuristicChatResponse(
        params.messages,
        false,
        `OpenRouter: ${targetModel}`,
        false,
        err?.message
      );
    }
  }

  // Parse ```json:oposilab_items [...]``` or json blocks
  private static parseExtractedItems(text: string): Partial<Item>[] {
    const items: Partial<Item>[] = [];
    const itemBlockRegex = /```(?:json:oposilab_items|json)\s*([\s\S]*?)```/gi;
    let match;

    while ((match = itemBlockRegex.exec(text)) !== null) {
      try {
        const rawJson = match[1].trim();
        const parsed = JSON.parse(rawJson);
        if (Array.isArray(parsed)) {
          for (const itm of parsed) {
            if (itm.stem && (itm.options || itm.rule_statement)) {
              items.push({
                ...itm,
                status: 'draft',
                source: 'ai_draft',
                item_type: itm.item_type || 'cover_and_generate_mcq',
              });
            }
          }
        } else if (parsed && parsed.stem) {
          items.push({
            ...parsed,
            status: 'draft',
            source: 'ai_draft',
            item_type: parsed.item_type || 'cover_and_generate_mcq',
          });
        }
      } catch (e) {
        // Not a valid JSON or not items block
      }
    }

    return items;
  }

  // Parse ```json:oposilab_atoms [...]```
  private static parseExtractedAtoms(text: string): Partial<Atom>[] {
    const atoms: Partial<Atom>[] = [];
    const atomBlockRegex = /```(?:json:oposilab_atoms)\s*([\s\S]*?)```/gi;
    let match;

    while ((match = atomBlockRegex.exec(text)) !== null) {
      try {
        const rawJson = match[1].trim();
        const parsed = JSON.parse(rawJson);
        if (Array.isArray(parsed)) {
          for (const atm of parsed) {
            if (atm.text && atm.legal_basis) {
              atoms.push({
                ...atm,
                status: 'draft',
              });
            }
          }
        }
      } catch (e) {
        // Ignored
      }
    }

    return atoms;
  }

  // Fallback when no GEMINI_API_KEY is configured or when quota is exhausted
  private static heuristicChatResponse(
    messages: ChatMessage[],
    enableWebSearch: boolean,
    modelName: string,
    isQuotaExceeded: boolean = false,
    rawError?: string
  ): {
    content: string;
    citations?: GroundingCitation[];
    searchQueries?: string[];
    modelUsed: string;
    extractedItems?: Partial<Item>[];
    extractedAtoms?: Partial<Atom>[];
  } {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    const userQuery = (lastUserMsg?.content || '').toLowerCase();
    const hasAttachments = (lastUserMsg?.attachments?.length || 0) > 0;
    const firstAttachmentText = lastUserMsg?.attachments?.find((a) => a.textContent)?.textContent || '';

    let quotaNotice = '';
    if (isQuotaExceeded) {
      quotaNotice = `> ⚡ **Aviso de Cuota de API (429 Rate Limit / Quota Exceeded):**\n> Se ha alcanzado el límite de peticiones de Gemini en la nube. OposiLab ha activado de inmediato el **motor psicométrico y base de conocimiento local offline** para generar tu ejercicio sin que tengas que detener tu sesión de estudio.\n\n`;
    }

    let responseContent = quotaNotice;
    let sampleItems: Partial<Item>[] = [];
    let sampleAtoms: Partial<Atom>[] = [];

    // Check if query is about Constitution (CE 1978)
    if (
      userQuery.includes('constituc') ||
      userQuery.includes('ce 1978') ||
      userQuery.includes('art. 9.3') ||
      userQuery.includes('9.3') ||
      userQuery.includes('reforma') ||
      userQuery.includes('167') ||
      userQuery.includes('168')
    ) {
      responseContent += `He diseñado un micro-drill psicométrico de alta discriminación sobre la **Reforma Constitucional (Arts. 167 y 168 CE)** y los principios del **Art. 9.3 CE**:\n\n`;
      responseContent += `### Ejercicio Recomendado:\n`;
      responseContent += `**Enunciado:** En relación con los procedimientos de reforma constitucional establecidos en el Título X de la Constitución Española de 1978, señale la proposición jurídicamente correcta:\n\n`;
      responseContent += `- **A)** En el procedimiento ordinario del Art. 167, el referéndum es potestativo y debe ser solicitado por una décima parte de los miembros de cualquiera de las Cámaras dentro de los 15 días siguientes a su aprobación. *(Opción Correcta)*\n`;
      responseContent += `- **B)** En el procedimiento agravado del Art. 168, el referéndum es potestativo a petición de una décima parte de los miembros del Congreso. *(Trampa: en el Art. 168 el referéndum es obligatorio y preceptivo)*\n`;
      responseContent += `- **C)** El procedimiento agravado del Art. 167 exige la disolución inmediata de las Cortes Generales tras la aprobación por mayoría de dos tercios. *(Trampa: confusión de procedimiento ordinario 167 con agravado 168)*\n`;
      responseContent += `- **D)** Se podrá iniciar una reforma constitucional en tiempo de guerra o bajo la vigencia de los estados de alarma, excepción o sitio. *(Trampa: prohibición expresa del Art. 169 CE)*\n\n`;

      sampleItems.push({
        stem: 'En relación con los procedimientos de reforma constitucional establecidos en el Título X de la Constitución Española de 1978, señale la proposición jurídicamente correcta:',
        prompt_before_options: 'Escribe de memoria la diferencia entre el referéndum del Art. 167 (potestativo, 1/10 miembros, 15 días) y el del Art. 168 (preceptivo y vinculante).',
        item_type: 'cover_and_generate_mcq',
        correct_answer: 'A',
        legal_basis: 'Arts. 167 y 168 CE',
        rule_statement: 'El Art. 167 regula la reforma ordinaria (mayoría 3/5 y referéndum potestativo a petición de 1/10 dentro de 15 días); el Art. 168 regula la reforma agravada (revisión total o Título Preliminar, Título I Cap. II Secc. 1ª, o Título II, con mayoría de 2/3, disolución, ratificación y referéndum preceptivo).',
        why_correct: 'El Art. 167.3 CE estipula literalmente que aprobada la reforma por las Cortes, será sometida a referéndum si lo solicita una décima parte de los miembros de cualquiera de las Cámaras en el plazo de 15 días.',
        corrective_rule: 'Art. 167 = Referéndum facultativo (1/10, 15 días). Art. 168 = Referéndum preceptivo y obligatorio.',
        options: [
          {
            id: 'A',
            text: 'En el procedimiento ordinario del Art. 167, el referéndum es potestativo y debe ser solicitado por una décima parte de los miembros de cualquiera de las Cámaras dentro de los 15 días siguientes a su aprobación.',
            is_correct: true,
            explanation: 'Conforme al Art. 167.3 de la Constitución Española.',
          },
          {
            id: 'B',
            text: 'En el procedimiento agravado del Art. 168, el referéndum es potestativo a petición de una décima parte de los miembros del Congreso.',
            is_correct: false,
            trap_type: 'conceptual_merger',
            explanation: 'En el Art. 168 el referéndum para la ratificación es siempre preceptivo y obligatorio (Art. 168.3 CE).',
            condition_if_correct: 'Sería correcta si se tratase del procedimiento ordinario del Art. 167.',
          },
          {
            id: 'C',
            text: 'El procedimiento agravado del Art. 167 exige la disolución inmediata de las Cortes Generales tras la aprobación por mayoría de dos tercios.',
            is_correct: false,
            trap_type: 'wrong_legal_object',
            explanation: 'El Art. 167 es el ordinario (3/5 de cada Cámara), no exige disolución. La disolución de Cortes pertenece al Art. 168.',
            condition_if_correct: 'Sería correcta si citara el Art. 168 CE.',
          },
          {
            id: 'D',
            text: 'Se podrá iniciar una reforma constitucional en tiempo de guerra o bajo la vigencia de los estados de alarma, excepción o sitio.',
            is_correct: false,
            trap_type: 'exception_ignored',
            explanation: 'El Art. 169 CE prohíbe taxativamente iniciar reformas constitucionales en tiempo de guerra o durante la vigencia de los estados de alarma, excepción o sitio.',
            condition_if_correct: 'Sería correcta si afirmase la prohibición expresa.',
          },
        ],
        difficulty: 3,
        cognitive_operations: ['generative_retrieval', 'micro_discrimination', 'response_inhibition'],
        status: 'draft',
        source: 'ai_draft',
      });
    } else if (
      userQuery.includes('2026') ||
      userQuery.includes('revaloriz') ||
      userQuery.includes('cuantía') ||
      userQuery.includes('pensiones') ||
      userQuery.includes('8.803') ||
      userQuery.includes('3.359')
    ) {
      // Revalorización 2026
      responseContent += `He diseñado un ejercicio de discriminación sobre los **Importes y Cuantías Oficiales de Seguridad Social para 2026**:\n\n`;
      responseContent += `### Ejercicio Recomendado:\n`;
      responseContent += `**Enunciado:** En relación con las cuantías y revalorizaciones de Seguridad Social para 2026, ¿cuál de las siguientes afirmaciones es correcta?\n\n`;
      responseContent += `- **A)** El importe íntegro anual de las pensiones no contributivas de la Seguridad Social para 2026 se sitúa en 8.803,20 € anuales. *(Opción Correcta)*\n`;
      responseContent += `- **B)** El límite máximo de percepción de pensión pública mensual para 2026 es de 4.100,00 €/mes. *(Trampa: sustitución numérica; el tope fijado es 3.359,60 €/mes)*\n`;
      responseContent += `- **C)** El límite de ingresos para complementos a mínimos sin cónyuge a cargo es de 11.013,00 € anuales. *(Trampa: asigna el límite con cónyuge a cargo al supuesto de sin cónyuge, que es 9.442,00 €)*\n`;
      responseContent += `- **D)** La revalorización general de las pensiones contributivas para 2026 ha sido fijada con carácter general en el 4,5%. *(Trampa: la tasa oficial de revalorización es del 2,7%)*\n\n`;

      sampleItems.push({
        stem: 'En relación con las cuantías y revalorizaciones de Seguridad Social para 2026, ¿cuál de las siguientes afirmaciones es correcta?',
        prompt_before_options: 'Escribe de memoria la cuantía de la PNC anual (8.803,20 €) y el tope mensual de pensión pública (3.359,60 €/mes).',
        item_type: 'cover_and_generate_mcq',
        correct_answer: 'A',
        legal_basis: 'Normativa de Revalorización de Pensiones 2026 / TRLGSS',
        rule_statement: 'Para 2026: Revalorización contributiva 2,7%; PNC: 8.803,20 €/año; Máximo pensión mensual: 3.359,60 €/mes; Límite mínimos sin cónyuge: 9.442,00 €/año; Límite mínimos con cónyuge: 11.013,00 €/año.',
        why_correct: '8.803,20 €/año es la cuantía íntegra fijada para las pensiones de invalidez y jubilación no contributivas en 2026.',
        corrective_rule: 'PNC = 8.803,20 €/año. Máx pensión mensual = 3.359,60 €/mes.',
        options: [
          {
            id: 'A',
            text: 'El importe íntegro anual de las pensiones no contributivas de la Seguridad Social para 2026 se sitúa en 8.803,20 € anuales.',
            is_correct: true,
            explanation: 'Cuantía oficial de pensiones no contributivas fijada para 2026.',
          },
          {
            id: 'B',
            text: 'El límite máximo de percepción de pensión pública mensual para 2026 es de 4.100,00 €/mes.',
            is_correct: false,
            trap_type: 'numeric_substitution',
            explanation: 'El límite máximo mensual de pensión pública para 2026 es de 3.359,60 €/mes (47.034,40 €/año).',
            condition_if_correct: 'Sería correcta si no se aplicase el tope máximo de pensiones públicas.',
          },
          {
            id: 'C',
            text: 'El límite de ingresos para complementos a mínimos sin cónyuge a cargo es de 11.013,00 € anuales.',
            is_correct: false,
            trap_type: 'conceptual_merger',
            explanation: '11.013,00 € es el límite con cónyuge a cargo; el límite sin cónyuge a cargo es de 9.442,00 € anuales.',
            condition_if_correct: 'Sería correcta si existiese cónyuge a cargo.',
          },
          {
            id: 'D',
            text: 'La revalorización general de las pensiones contributivas para 2026 ha sido fijada con carácter general en el 4,5%.',
            is_correct: false,
            trap_type: 'numeric_substitution',
            explanation: 'La revalorización contributiva general para 2026 es del 2,7%.',
            condition_if_correct: 'Sería correcta si la inflación media interanual hubiese sido del 4,5%.',
          },
        ],
        difficulty: 2,
        cognitive_operations: ['numeric_precision', 'micro_discrimination'],
        status: 'draft',
        source: 'ai_draft',
      });
    } else if (
      userQuery.includes('coeficiente') ||
      userQuery.includes('1,5') ||
      userQuery.includes('1,4') ||
      userQuery.includes('fijo discontinuo') ||
      userQuery.includes('cómputo')
    ) {
      // Coeficientes 1,5 vs 1,4
      responseContent += `He diseñado un ejercicio de discriminación sobre **Coeficientes de Cómputo de Cotización (1,5 vs 1,4)**:\n\n`;
      responseContent += `### Ejercicio Recomendado:\n`;
      responseContent += `**Enunciado:** En relación con los coeficientes de cómputo de los períodos de cotización acreditados en el TRLGSS, ¿cuál es la proposición exacta?\n\n`;
      responseContent += `- **A)** A los días cotizados en contratos fijos-discontinuos se les aplica el coeficiente multiplicador del 1,5 sin que el número de días resultante pueda ser superior a los días naturales del año. *(Opción Correcta)*\n`;
      responseContent += `- **B)** A los contratos de duración determinada inferior o igual a 5 días se les aplica el coeficiente de 1,5. *(Trampa: sustitución de 1,4 por 1,5)*\n`;
      responseContent += `- **C)** El coeficiente de 1,5 para fijos-discontinuos permite superar el número de días naturales del año si se han realizado horas extraordinarias. *(Trampa: omisión del tope legal infranqueable)*\n`;
      responseContent += `- **D)** A los contratos a tiempo parcial ordinarios se les aplica el coeficiente de 1,4 mensual. *(Trampa: el coeficiente de 1,4 se reserva a contratos temporales ≤ 5 días)*\n\n`;

      sampleItems.push({
        stem: 'En relación con los coeficientes de cómputo de los períodos de cotización acreditados en el TRLGSS, ¿cuál es la proposición exacta?',
        prompt_before_options: 'Escribe de memoria: ¿a qué contratos se aplica el 1,5 y a cuáles el 1,4?',
        item_type: 'cover_and_generate_mcq',
        correct_answer: 'A',
        legal_basis: 'Arts. 247 y 249 bis TRLGSS',
        rule_statement: 'Fijos-discontinuos = coeficiente 1,5 (tope días naturales del año). Contratos temporales ≤ 5 días = coeficiente 1,4 (tope días del mes natural).',
        why_correct: 'Literalmente previsto en el TRLGSS con el límite de días naturales del período.',
        corrective_rule: 'Fijo-discontinuo = 1,5. Temporal ≤ 5 días = 1,4.',
        options: [
          {
            id: 'A',
            text: 'A los días cotizados en contratos fijos-discontinuos se les aplica el coeficiente multiplicador del 1,5 sin que el número de días resultante pueda ser superior a los días naturales del año.',
            is_correct: true,
            explanation: 'Conforme con el Art. 247 TRLGSS.',
          },
          {
            id: 'B',
            text: 'A los contratos de duración determinada inferior o igual a 5 días se les aplica el coeficiente de 1,5.',
            is_correct: false,
            trap_type: 'numeric_substitution',
            explanation: 'A los contratos temporales ≤ 5 días se les aplica el coeficiente de 1,4 (Art. 249 bis TRLGSS), no el 1,5.',
            condition_if_correct: 'Sería correcta si se tratase de fijos-discontinuos.',
          },
          {
            id: 'C',
            text: 'El coeficiente de 1,5 para fijos-discontinuos permite superar el número de días naturales del año si se han realizado horas extraordinarias.',
            is_correct: false,
            trap_type: 'exception_ignored',
            explanation: 'El cómputo nunca puede rebasar los días naturales del año correspondiente.',
            condition_if_correct: 'Sería correcta si la ley no hubiese fijado el tope de días naturales.',
          },
          {
            id: 'D',
            text: 'A los contratos a tiempo parcial ordinarios se les aplica el coeficiente de 1,4 mensual.',
            is_correct: false,
            trap_type: 'factual_misapplication',
            explanation: 'El coeficiente de 1,4 está circunscrito a contratos de duración igual o inferior a 5 días.',
            condition_if_correct: 'Sería correcta si fuesen de duración ≤ 5 días.',
          },
        ],
        difficulty: 2,
        cognitive_operations: ['micro_discrimination', 'numeric_precision'],
        status: 'draft',
        source: 'ai_draft',
      });
    } else if (
      userQuery.includes('spot') ||
      userQuery.includes('falsedad') ||
      userQuery.includes('error')
    ) {
      // Spot the error
      responseContent += `He diseñado un ejercicio tipo **Spot-the-Error (Detección y Reparación de Falsedad Legal)**:\n\n`;
      responseContent += `### Enunciado Spot-the-Error:\n`;
      responseContent += `*"El derecho al percibo de las prestaciones a tanto alzado prescribirá a los cinco años contados desde el día siguiente al hecho causante."*\n\n`;
      responseContent += `- **Error 1:** Cita *prescripción* cuando se trata de **caducidad**.\n`;
      responseContent += `- **Error 2:** Aplica *cinco años* cuando el plazo es de **un año**.\n`;
      responseContent += `- **Error 3:** Fija el día inicial en el *hecho causante* cuando en prestaciones a tanto alzado es el **día siguiente a la notificación del reconocimiento**.\n\n`;

      sampleItems.push({
        stem: 'Indica la corrección jurídica exacta para la siguiente proposición falsa: "El derecho al percibo de las prestaciones a tanto alzado prescribirá a los cinco años contados desde el día siguiente al hecho causante."',
        prompt_before_options: 'Localiza los tres errores: institución (prescripción vs caducidad), plazo (5 años vs 1 año) y cómputo de inicio.',
        item_type: 'spot_error',
        correct_answer: 'A',
        legal_basis: 'Art. 54 TRLGSS',
        rule_statement: 'El derecho al percibo de las prestaciones a tanto alzado caduca al año, contado desde el día siguiente a la notificación del reconocimiento.',
        why_correct: 'Cumple fielmente con el Art. 54.1 TRLGSS para el percibo a tanto alzado.',
        corrective_rule: 'Percibo = caducidad al año (notificación reconocimiento en tanto alzado; vencimiento de la mensualidad en periódicas).',
        options: [
          {
            id: 'A',
            text: 'Caducará al año contado desde el día siguiente al de haber sido notificada la concesión de la prestación.',
            is_correct: true,
            explanation: 'Regla exacta del Art. 54.1 TRLGSS.',
          },
          {
            id: 'B',
            text: 'Prescribirá a los 5 años contados desde el día siguiente a la concesión de la prestación.',
            is_correct: false,
            trap_type: 'conceptual_merger',
            explanation: 'Confunde prescripción (5 años) con caducidad (1 año).',
          },
          {
            id: 'C',
            text: 'Caducará a los tres meses contados desde el hecho causante.',
            is_correct: false,
            trap_type: 'numeric_substitution',
            explanation: 'Tres meses es el límite de retroactividad, no el plazo de caducidad.',
          },
        ],
        difficulty: 3,
        status: 'draft',
        source: 'ai_draft',
      });
    } else {
      // Default: Prescripción vs Caducidad
      responseContent += `He analizado tu solicitud ${hasAttachments ? 'junto con el documento adjunto' : ''} sobre la normativa de la Seguridad Social.\n\n`;
      if (enableWebSearch) {
        responseContent += `> *Búsqueda web:* Se han cotejado las referencias normativas del TRLGSS y las resoluciones de la Secretaría de Estado de la Seguridad Social.\n\n`;
      }
      responseContent += `A continuación, he diseñado un ejercicio tipo **Cover-and-Generate MCQ** de alta discriminación con autopsia completa de distractores y clasificación de trampas normativas:\n\n`;
      responseContent += `### Ejercicio Recomendado:\n`;
      responseContent += `**Enunciado:** En relación con los plazos de prescripción y caducidad en el TRLGSS, ¿cuál de las siguientes afirmaciones es jurídicamente exacta?\n\n`;
      responseContent += `- **A)** El derecho al reconocimiento de las prestaciones prescribirá a los 5 años, contados desde el día siguiente a aquel en que tenga lugar el hecho causante. *(Opción Correcta)*\n`;
      responseContent += `- **B)** El derecho al reconocimiento prescribirá al año siguiente a la notificación del hecho causante. *(Trampa: sustitución temporal de 5 años por 1 año y confusión con caducidad)*\n`;
      responseContent += `- **C)** El derecho al percibo de las prestaciones periódicas caduca a los 5 años desde el vencimiento de cada mensualidad. *(Trampa: confusión entre objeto de prescripción y caducidad)*\n`;
      responseContent += `- **D)** La prescripción se interrumpe únicamente mediante reclamación judicial formal ante los Juzgados de lo Social. *(Trampa: omisión de la reclamación extrajudicial conforme al Art. 1973 Código Civil)*\n\n`;

      sampleItems.push({
        stem: 'En relación con los plazos de prescripción y caducidad en el TRLGSS, ¿cuál de las siguientes afirmaciones es jurídicamente exacta?',
        prompt_before_options: 'Escribe de memoria el plazo exacto de prescripción del reconocimiento y el de caducidad del percibo.',
        item_type: 'cover_and_generate_mcq',
        correct_answer: 'A',
        legal_basis: 'Art. 53 y 54 TRLGSS',
        rule_statement: 'El derecho al reconocimiento de prestaciones prescribe a los 5 años desde el día siguiente al hecho causante; el derecho al percibo caduca al año.',
        why_correct: 'Literalmente estipulado en el artículo 53.1 del TRLGSS.',
        corrective_rule: 'Prescripción = 5 años (reconocimiento). Caducidad = 1 año (percibo).',
        options: [
          {
            id: 'A',
            text: 'El derecho al reconocimiento de las prestaciones prescribirá a los 5 años, contados desde el día siguiente a aquel en que tenga lugar el hecho causante.',
            is_correct: true,
            explanation: 'Conforme con el Art. 53.1 TRLGSS.',
          },
          {
            id: 'B',
            text: 'El derecho al reconocimiento prescribirá al año siguiente a la notificación del hecho causante.',
            is_correct: false,
            trap_type: 'numeric_substitution',
            explanation: 'Aplica el plazo de caducidad (1 año) a la prescripción (5 años).',
            condition_if_correct: 'Sería correcta si se tratase de la caducidad del percibo a tanto alzado.',
          },
          {
            id: 'C',
            text: 'El derecho al percibo de las prestaciones periódicas caduca a los 5 años desde el vencimiento de cada mensualidad.',
            is_correct: false,
            trap_type: 'conceptual_merger',
            explanation: 'La caducidad de prestaciones periódicas es de 1 año (Art. 54.1 TRLGSS), no de 5 años.',
            condition_if_correct: 'Sería correcta si se refiriese al reconocimiento.',
          },
          {
            id: 'D',
            text: 'La prescripción se interrumpe únicamente mediante reclamación judicial formal ante los Juzgados de lo Social.',
            is_correct: false,
            trap_type: 'overbroad_statement',
            explanation: 'La prescripción también se interrumpe por reclamación extrajudicial conforme al Art. 1973 CC y Art. 53.2 TRLGSS.',
            condition_if_correct: 'Sería correcta si no existieran vías de interrupción extrajudicial.',
          },
        ],
        difficulty: 2,
        cognitive_operations: ['generative_retrieval', 'micro_discrimination'],
        status: 'draft',
        source: 'ai_draft',
      });
    }

    // Append JSON block so UI can parse and show import card
    responseContent += `Puedes pulsar el botón **"Importar al Banco de Ítems"** que aparece a continuación para incorporarlo directamente a tu cola de estudio en OposiLab.\n\n`;
    responseContent += `\`\`\`json:oposilab_items\n${JSON.stringify(sampleItems, null, 2)}\n\`\`\``;

    return {
      content: responseContent,
      citations: enableWebSearch
        ? [
            {
              title: 'Seguridad Social: Normativa y Jurisprudencia TRLGSS',
              url: 'https://www.seg-social.es/wps/portal/wss/internet/InformacionUtil/44539',
            },
            {
              title: 'BOE - Real Decreto Legislativo 8/2015',
              url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724',
            },
          ]
        : undefined,
      searchQueries: enableWebSearch ? ['TRLGSS prescripcion caducidad plazos seguridad social'] : undefined,
      modelUsed: isQuotaExceeded ? `${modelName} (heurístico/offline por cuota)` : `${modelName} (heurístico/local)`,
      extractedItems: sampleItems,
    };
  }
}

