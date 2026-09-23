import React, { useState, useMemo } from 'react';
import {
  FolderGit2,
  FileText,
  Plus,
  CheckCircle,
  AlertCircle,
  Trash2,
  Layers,
  Target,
  Tag,
  Search,
  ShieldAlert,
  BrainCircuit,
  Check,
  Zap,
  Gauge,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Split,
  Eye,
  RefreshCw,
  CheckCheck,
  Upload,
  Bookmark,
  Wand2,
} from 'lucide-react';
import { Atom, Cluster, ConfusionPair, AtomType, Topic, Item } from '../types.ts';
import { api } from '../api.ts';
import {
  auditItemPedagogicalQuality,
  PedagogicalDiagnostic,
} from '../utils/learningDesignValidator.ts';

interface ContentStudioProps {
  atoms: Atom[];
  clusters: Cluster[];
  confusionPairs: ConfusionPair[];
  topics: Topic[];
  items?: Item[];
  onRefresh: () => void;
}

export const ContentStudio: React.FC<ContentStudioProps> = ({
  atoms,
  clusters,
  confusionPairs,
  topics,
  items = [],
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<
    'atoms' | 'import' | 'clusters' | 'confusion_pairs' | 'validator'
  >('atoms');

  // Import & Rapid Set Assistant states
  const [sourceText, setSourceText] = useState('');
  const [articleRef, setArticleRef] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [draftedAtoms, setDraftedAtoms] = useState<Partial<Atom>[]>([]);
  // Local-first (offline) import pipeline states
  const [pdfPages, setPdfPages] = useState<Array<{ pageNumber: number; text: string }> | null>(null);
  const [pdfImportError, setPdfImportError] = useState<string | null>(null);
  const [isImportingPdf, setIsImportingPdf] = useState(false);
  const [isSuggestingOffline, setIsSuggestingOffline] = useState(false);
  const [isCreatingChunks, setIsCreatingChunks] = useState(false);
  const [chunkStatus, setChunkStatus] = useState<string | null>(null);
  const [selectedSetTopicId, setSelectedSetTopicId] = useState<string>(
    topics[0]?.id || 'tema_7_seguridad_social'
  );
  const [isCreatingNewTopic, setIsCreatingNewTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');
  const [extractedSet, setExtractedSet] = useState<{
    summary: string;
    detectedLegalBasis?: string;
    clusters: Array<Partial<Cluster> & { temp_id: string; selected: boolean }>;
    atoms: Array<Partial<Atom> & { temp_cluster_id?: string; selected: boolean }>;
    confusionPairs: Array<Partial<ConfusionPair> & { selected: boolean }>;
  } | null>(null);
  const [isSavingFullSet, setIsSavingFullSet] = useState(false);
  const [setFilterCluster, setSetFilterCluster] = useState<string>('all');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [activeSetSubTab, setActiveSetSubTab] = useState<'atoms' | 'clusters' | 'confusion_pairs'>(
    'atoms'
  );

  // Manual atom creation state
  const [newAtomText, setNewAtomText] = useState('');
  const [newAtomType, setNewAtomType] = useState<AtomType>('deadline');
  const [newAtomBasis, setNewAtomBasis] = useState('');
  const [newAtomClusterId, setNewAtomClusterId] = useState('');
  const [newAtomPairId, setNewAtomPairId] = useState('');

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // ----------------------------------------------------
  // Interactive Learning Design Quality Validator States
  // ----------------------------------------------------
  const [selectedItemIdToAudit, setSelectedItemIdToAudit] = useState<string>('custom');
  const [auditStem, setAuditStem] = useState<string>(
    '¿A los cuántos años prescribe el derecho al reconocimiento de las prestaciones de la Seguridad Social según el artículo 53.1?'
  );
  const [auditCorrectAnswer, setAuditCorrectAnswer] = useState<string>('A los 5 años desde el hecho causante');
  const [auditDistractor1, setAuditDistractor1] = useState<string>('Al año desde la notificación');
  const [auditDistractor2, setAuditDistractor2] = useState<string>('A los 4 años conforme a la Ley General Tributaria');
  const [auditDistractor3, setAuditDistractor3] = useState<string>('A los 3 meses anteriores a la solicitud');
  const [auditLegalBasis, setAuditLegalBasis] = useState<string>('Art. 53.1 TRLGSS');
  const [auditItemType, setAuditItemType] = useState<string>('cover_and_generate_mcq');
  const [auditSaveStatus, setAuditSaveStatus] = useState<string | null>(null);

  // Compute live diagnostic for current draft in validator
  const currentDraftItem: Partial<Item> = useMemo(() => {
    return {
      id: selectedItemIdToAudit !== 'custom' ? selectedItemIdToAudit : 'draft_validator_item',
      stem: auditStem,
      correct_answer: auditCorrectAnswer,
      legal_basis: auditLegalBasis,
      item_type: auditItemType as any,
      options: [
        {
          id: 'opt-a',
          text: auditCorrectAnswer,
          is_correct: true,
          explanation: 'Es la regla general estricta del Art. 53.1 TRLGSS.',
        },
        {
          id: 'opt-b',
          text: auditDistractor1,
          is_correct: false,
          trap_type: 'temporal_confusion',
          explanation: 'Confunde el plazo de prescripción con el de caducidad del percibo (Art. 54).',
        },
        {
          id: 'opt-c',
          text: auditDistractor2,
          is_correct: false,
          trap_type: 'familiar_wording_trap',
          explanation: 'Aplica el plazo de prescripción tributario en lugar del régimen de la SS.',
        },
        {
          id: 'opt-d',
          text: auditDistractor3,
          is_correct: false,
          trap_type: 'partial_rule_accuracy',
          explanation: 'Confunde el plazo de prescripción con la retroactividad de efectos económicos.',
        },
      ],
    };
  }, [
    selectedItemIdToAudit,
    auditStem,
    auditCorrectAnswer,
    auditDistractor1,
    auditDistractor2,
    auditDistractor3,
    auditLegalBasis,
    auditItemType,
  ]);

  const liveDiagnostic: PedagogicalDiagnostic = useMemo(() => {
    return auditItemPedagogicalQuality(currentDraftItem);
  }, [currentDraftItem]);

  // Batch audit of all existing items in the database
  const batchAuditResults = useMemo(() => {
    return items.map((itm) => {
      const diag = auditItemPedagogicalQuality(itm);
      return {
        item: itm,
        diag,
        hasCritical: diag.warnings.some((w) => w.severity === 'critical'),
        hasAnswerInStem: diag.answerInStem.detected,
        hasOverload: diag.overloadedConcepts.detected,
        hasLengthBias: diag.longestOptionBias.detected,
      };
    });
  }, [items]);

  const flaggedBatchItems = useMemo(() => {
    return batchAuditResults.filter(
      (r) => r.hasAnswerInStem || r.hasOverload || r.hasLengthBias || r.diag.score < 80
    );
  }, [batchAuditResults]);

  const handleSelectAuditedItem = (itemId: string) => {
    setSelectedItemIdToAudit(itemId);
    if (itemId === 'custom') return;
    const found = items.find((i) => i.id === itemId);
    if (found) {
      setAuditStem(found.stem || '');
      setAuditLegalBasis(found.legal_basis || '');
      setAuditItemType(found.item_type || 'cover_and_generate_mcq');
      const correctOpt = found.options?.find((o) => o.is_correct || o.id === found.correct_answer);
      setAuditCorrectAnswer(correctOpt?.text || found.correct_answer || '');
      const distractors = found.options?.filter((o) => !o.is_correct && o.id !== found.correct_answer) || [];
      setAuditDistractor1(distractors[0]?.text || '');
      setAuditDistractor2(distractors[1]?.text || '');
      setAuditDistractor3(distractors[2]?.text || '');
    }
  };

  // Sample presets for demonstrating the learning design logic
  const loadPreset = (type: 'answer_in_stem' | 'overloaded' | 'length_bias' | 'optimal') => {
    setSelectedItemIdToAudit('custom');
    if (type === 'answer_in_stem') {
      setAuditStem(
        '¿A los cuántos años opera la prescripción de cinco años del derecho al reconocimiento de las prestaciones según el artículo 53.1 del TRLGSS?'
      );
      setAuditCorrectAnswer('A los cinco años contados desde el día siguiente al hecho causante');
      setAuditDistractor1('Al año siguiente a la notificación del reconocimiento');
      setAuditDistractor2('A los tres meses anteriores a la solicitud');
      setAuditDistractor3('A los 30 días naturales siguientes');
      setAuditLegalBasis('Art. 53.1 TRLGSS');
    } else if (type === 'overloaded') {
      setAuditStem(
        '¿Cuál es el plazo de prescripción, qué órgano es el competente para resolver, qué porcentaje de recargo procede por falta de medidas de seguridad y qué excepción rige si la empresa está en concurso de acreedores?'
      );
      setAuditCorrectAnswer('5 años, INSS, recargo del 30 al 50% y no asunción por el FOGASA');
      setAuditDistractor1('1 año, TGSS, recargo del 20% y pago delegado mutua');
      setAuditDistractor2('3 meses, Inspección de Trabajo, recargo del 10% y pago directo');
      setAuditDistractor3('4 años, Tesorería, recargo del 50% con asunción subsidiaria');
      setAuditLegalBasis('Arts. 53, 164 y 167 TRLGSS');
    } else if (type === 'length_bias') {
      setAuditStem(
        '¿Qué consecuencia jurídica se produce ante el incumplimiento empresarial de la obligación de afiliación y alta en el Régimen General?'
      );
      setAuditCorrectAnswer(
        'Se genera una responsabilidad patronal directa en el anticipo y abono de las prestaciones económicas, sin perjuicio de la subrogación posterior de la entidad gestora o mutua colaboradora y de la imposición de las correspondientes sanciones administrativas y recargo de cotizaciones.'
      );
      setAuditDistractor1('Exoneración patronal total.');
      setAuditDistractor2('Derivación automática al FOGASA.');
      setAuditDistractor3('Pérdida sobrevenida del derecho a litigar.');
      setAuditLegalBasis('Art. 167.1 TRLGSS');
    } else {
      setAuditStem(
        '¿A partir de qué fecha comienzan a surtir efectos económicos las prestaciones de Seguridad Social reconocidas como consecuencia de una solicitud inicial?'
      );
      setAuditCorrectAnswer('A partir de los 3 meses anteriores a la fecha en que se presente la solicitud');
      setAuditDistractor1('Desde el día siguiente a aquel en que tenga lugar el hecho causante');
      setAuditDistractor2('Desde la fecha de notificación de la resolución expresa');
      setAuditDistractor3('A partir del primer día del mes siguiente a la solicitud');
      setAuditLegalBasis('Art. 53.1 TRLGSS');
    }
  };

  const atomTypes: AtomType[] = [
    'deadline',
    'number',
    'amount',
    'percentage',
    'coefficient',
    'condition',
    'exception',
    'competent_body',
    'definition',
    'legal_effect',
    'procedure',
  ];

  // Rapid Set Assistant: 1-Click extraction of Clusters, Atoms & Confusion Pairs
  const handleExtractFullSet = async () => {
    if (!sourceText.trim()) return;
    setIsExtracting(true);
    setSaveSuccessMessage(null);
    try {
      const res = await api.aiExtractSet(sourceText, articleRef);
      if (res) {
        setExtractedSet({
          summary: res.summary || 'Set analizado y estructurado con éxito.',
          detectedLegalBasis: res.detectedLegalBasis || articleRef || 'TRLGSS',
          clusters: (res.clusters || []).map((c) => ({ ...c, selected: true })),
          atoms: (res.atoms || []).map((a) => ({ ...a, selected: true })),
          confusionPairs: (res.confusionPairs || []).map((cp) => ({ ...cp, selected: true })),
        });
        setDraftedAtoms(res.atoms || []);
      }
    } catch (err) {
      console.error('Full set extraction error:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveFullSet = async () => {
    if (!extractedSet) return;
    setIsSavingFullSet(true);
    setSaveSuccessMessage(null);

    try {
      // 1. Resolve target topic
      let targetTopicId = selectedSetTopicId;
      if (isCreatingNewTopic || selectedSetTopicId === '__new__') {
        const createdTopic = await api.createTopic({
          name: newTopicName.trim() || `Set: ${articleRef || 'Normativa Extraída'}`,
          description:
            newTopicDesc.trim() ||
            `Generado en 1-clic con el Asistente de Sets (${new Date().toLocaleDateString('es-ES')})`,
          status: 'active',
        });
        targetTopicId = createdTopic.id;
        setSelectedSetTopicId(targetTopicId);
        setIsCreatingNewTopic(false);
      }

      // 2. Persist selected clusters & build temp_id -> real_id mapping
      const clusterMap: Record<string, string> = {};
      const selectedClusters = extractedSet.clusters.filter((c) => c.selected);

      for (const cl of selectedClusters) {
        const created = await api.createCluster({
          name: cl.name || 'Cluster Normativo',
          description: cl.description || '',
          type: cl.type || 'conceptual',
          priority: cl.priority || 'high',
          topic_id: targetTopicId,
        });
        if (cl.temp_id && created?.id) {
          clusterMap[cl.temp_id] = created.id;
        }
      }

      // 3. Persist selected atoms
      const selectedAtoms = extractedSet.atoms.filter((a) => a.selected);
      for (const at of selectedAtoms) {
        const resolvedClusterId = at.temp_cluster_id ? clusterMap[at.temp_cluster_id] : undefined;
        await api.createAtom({
          text: at.text || '',
          atom_type: at.atom_type || 'condition',
          legal_basis: at.legal_basis || extractedSet.detectedLegalBasis || 'TRLGSS',
          topic_id: targetTopicId,
          cluster_id: resolvedClusterId,
          difficulty: at.difficulty || 2,
          tags: at.tags || ['asistente_1clic', 'seguridad_social'],
          status: 'validated',
        });
      }

      // 4. Persist selected confusion pairs
      const selectedPairs = extractedSet.confusionPairs.filter((cp) => cp.selected);
      for (const cp of selectedPairs) {
        await api.createConfusionPair({
          concept_a: cp.concept_a || '',
          concept_b: cp.concept_b || '',
          discriminating_cue: cp.discriminating_cue || '',
          common_trap: cp.common_trap || '',
          legal_basis_a: cp.legal_basis_a || extractedSet.detectedLegalBasis || 'TRLGSS',
          legal_basis_b: cp.legal_basis_b || extractedSet.detectedLegalBasis || 'TRLGSS',
          severity: cp.severity || 'high',
          topic_id: targetTopicId,
          status: 'validated',
        });
      }

      setSaveSuccessMessage(
        `¡Set validado y guardado en 1 clic! Se han registrado ${selectedClusters.length} clústeres, ${selectedAtoms.length} proposiciones atómicas y ${selectedPairs.length} pares de confusión en el tema.`
      );
      setExtractedSet(null);
      setDraftedAtoms([]);
      onRefresh();
    } catch (err) {
      console.error('Failed to save full set:', err);
      alert('Hubo un error al guardar el set. Revisa la consola del navegador.');
    } finally {
      setIsSavingFullSet(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfImportError(null);

    // PDF → offline server-side extraction (pdfjs-dist, no AI, no network beyond localhost)
    if (file.name.toLowerCase().endsWith('.pdf')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        const base64 = dataUrl?.split(',')[1];
        if (!base64) return;
        setIsImportingPdf(true);
        try {
          const result = await api.importPdf(file.name, base64);
          setSourceText(result.fullText);
          setPdfPages(result.pages);
          if (!articleRef) setArticleRef(file.name.replace(/\.pdf$/i, ''));
        } catch (err: any) {
          setPdfImportError(
            err?.message || 'No se pudo extraer el texto del PDF. Pega el texto manualmente como alternativa.'
          );
        } finally {
          setIsImportingPdf(false);
        }
      };
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setSourceText(content);
        setPdfPages(null);
        if (!articleRef) {
          setArticleRef(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    };
    reader.readAsText(file);
  };

  // Offline (no-AI) atom suggestions from regex heuristics — drafts land in the
  // existing approval list, human validation required before they count.
  const handleSuggestAtomsOffline = async () => {
    if (!sourceText.trim()) return;
    setIsSuggestingOffline(true);
    try {
      const result = await api.suggestAtomsOffline(sourceText);
      setDraftedAtoms(
        result.suggestions.map((s) => ({
          text: s.text,
          atom_type: s.atom_type,
          legal_basis: s.legal_basis || articleRef || 'TRLGSS',
          tags: s.matched_markers,
          difficulty: Math.max(1, Math.min(5, Math.round(s.confidence * 4))),
          status: 'draft' as const,
        }))
      );
    } catch (err) {
      console.error('Offline suggestion error:', err);
    } finally {
      setIsSuggestingOffline(false);
    }
  };

  // Split source text (or PDF pages) into referenced SourceChunks.
  const handleCreateChunks = async () => {
    const targetTopicId =
      selectedSetTopicId !== '__new__' ? selectedSetTopicId : topics[0]?.id || 'tema_7_seguridad_social';
    setIsCreatingChunks(true);
    setChunkStatus(null);
    try {
      const input = pdfPages ? { pages: pdfPages } : { text: sourceText };
      const { chunks } = await api.splitChunks(input);
      for (const c of chunks) {
        await api.createSourceChunk({
          topic_id: targetTopicId,
          raw_text: c.raw_text,
          page_number: c.page_number,
          article_reference: c.article_reference || articleRef || undefined,
          order_index: c.order_index,
          summary: '',
        });
      }
      setChunkStatus(`${chunks.length} fragmentos creados${pdfPages ? ' con referencia de página' : ''}.`);
      onRefresh();
    } catch (err) {
      console.error('Chunk creation error:', err);
      setChunkStatus('Error al crear los fragmentos. Revisa la consola.');
    } finally {
      setIsCreatingChunks(false);
    }
  };

  // Heuristic extraction
  const handleExtractAtoms = async () => {
    if (!sourceText.trim()) return;
    setIsExtracting(true);
    try {
      const extracted = await api.aiExtractAtoms(sourceText);
      setDraftedAtoms(extracted);
    } catch (err) {
      console.error('Extraction error:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveDraftedAtom = async (atom: Partial<Atom>, index: number) => {
    try {
      const targetTopicId =
        selectedSetTopicId !== '__new__'
          ? selectedSetTopicId
          : topics[0]?.id || 'tema_7_seguridad_social';
      await api.createAtom({
        ...atom,
        topic_id: targetTopicId,
        status: 'validated',
      });
      setDraftedAtoms((prev) => prev.filter((_, i) => i !== index));
      onRefresh();
    } catch (err) {
      console.error('Failed to save atom:', err);
    }
  };

  const handleCreateManualAtom = async () => {
    if (!newAtomText.trim()) return;
    try {
      await api.createAtom({
        topic_id: topics[0]?.id || 'tema_7_seguridad_social',
        text: newAtomText,
        atom_type: newAtomType,
        legal_basis: newAtomBasis || 'TRLGSS',
        cluster_id: newAtomClusterId || undefined,
        confusion_pair_id: newAtomPairId || undefined,
        difficulty: 2,
        status: 'validated',
      });
      setNewAtomText('');
      setNewAtomBasis('');
      onRefresh();
    } catch (err) {
      console.error('Failed to create manual atom:', err);
    }
  };

  const handleDeleteAtom = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta proposición legal atómica?')) return;
    await api.deleteAtom(id);
    onRefresh();
  };

  const handleSaveAuditedItemToBank = async () => {
    try {
      if (selectedItemIdToAudit !== 'custom') {
        // Update existing item
        await api.updateItem(selectedItemIdToAudit, {
          stem: auditStem,
          legal_basis: auditLegalBasis,
          correct_answer: auditCorrectAnswer,
          options: currentDraftItem.options,
          status: liveDiagnostic.score >= 75 ? 'validated' : 'draft',
        });
        setAuditSaveStatus('Ítem actualizado en el Banco de Preguntas con éxito.');
      } else {
        // Create new item
        await api.createItem({
          topic_id: topics[0]?.id || 'tema_7_seguridad_social',
          item_type: auditItemType as any,
          stem: auditStem,
          prompt_before_options: 'Escribe la regla o plazo exacto de memoria antes de ver las opciones:',
          correct_answer: auditCorrectAnswer,
          legal_basis: auditLegalBasis,
          options: currentDraftItem.options as any,
          rule_statement: `Conforme a ${auditLegalBasis}: ${auditCorrectAnswer}`,
          why_correct: 'Respuesta conforme a la legalidad vigente.',
          corrective_rule: `Verificar la literalidad exacta de ${auditLegalBasis}.`,
          difficulty: 2,
          cognitive_operations: ['generative_retrieval', 'micro_discrimination'],
          status: liveDiagnostic.score >= 75 ? 'validated' : 'draft',
          source: 'manual',
        });
        setAuditSaveStatus('Nuevo ítem pedagógicamente validado y guardado en el Banco.');
      }
      setTimeout(() => setAuditSaveStatus(null), 4000);
      onRefresh();
    } catch (err) {
      console.error('Error saving item:', err);
    }
  };

  const filteredAtoms = atoms.filter((a) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      a.text.toLowerCase().includes(term) ||
      (a.legal_basis || a.legal || '').toLowerCase().includes(term) ||
      (a.atom_type || a.type || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-2">
          <FolderGit2 className="w-5 h-5 text-indigo-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Estudio de Contenidos & Proposiciones Atómicas
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          El contenido legal para oposiciones se atomiza en unidades mínimas evaluables y se somete a
          auditoría psicométrica de diseño instruccional para evitar reactivos defectuosos con pistas
          o sobrecarga cognitiva.
        </p>

        {/* Tab controls */}
        <div className="flex flex-wrap items-center gap-2 mt-5 border-t border-slate-800 pt-4">
          <button
            onClick={() => setActiveTab('atoms')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'atoms'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Átomos Validados ({atoms.length})
          </button>
          <button
            onClick={() => setActiveTab('validator')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              activeTab === 'validator'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-emerald-400 hover:bg-slate-750'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Validador de Diseño de Aprendizaje</span>
            {flaggedBatchItems.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-emerald-950 text-emerald-300 rounded text-[10px] font-mono">
                {flaggedBatchItems.length} alertas
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              activeTab === 'import'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-800 text-amber-400 hover:bg-slate-750'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Asistente de Sets (1 Clic)</span>
          </button>
          <button
            onClick={() => setActiveTab('clusters')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'clusters'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Clusters Temáticos ({clusters.length})
          </button>
          <button
            onClick={() => setActiveTab('confusion_pairs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'confusion_pairs'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Pares Confusos ({confusionPairs.length})
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 0. LEARNING DESIGN QUALITY VALIDATOR (NEW TAB)       */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'validator' && (
        <div className="space-y-6">
          {/* Top banner explaining learning design rationale */}
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/50 border border-emerald-500/30 p-5 rounded-2xl">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <BrainCircuit className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-sm font-bold text-emerald-300">
                    Motor de Validación Psicométrica & Carga Cognitiva
                  </h2>
                </div>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  Basado en los principios de psicometría de reactivos de oposición y teoría de carga
                  cognitiva (Sweller / Haladyna). Detecta automáticamente dos fallos críticos en la
                  redacción de tipo test:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                    <span className="text-xs font-bold text-amber-300 block">
                      🎯 Pistas en el Enunciado (Answer Leakage)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Ocurre cuando el texto de la pregunta incluye la regla o palabra clave de la
                      opción correcta, reduciendo la dificultad a mero reconocimiento visual.
                    </span>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                    <span className="text-xs font-bold text-indigo-300 block">
                      🧠 Sobrecarga de Conceptos (Multi-Focal Overload)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Ocurre cuando un único reactivo cruza $\ge 3$ decisiones normativas
                      heterogéneas (plazo + órgano + excepción + sanción), impidiendo diagnosticar el
                      vacío real.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Test Presets */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 mr-1">Cargar caso de prueba:</span>
              <button
                onClick={() => loadPreset('answer_in_stem')}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[11px] font-medium transition"
              >
                ⚠️ Pista en el Enunciado
              </button>
              <button
                onClick={() => loadPreset('overloaded')}
                className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[11px] font-medium transition"
              >
                ⚠️ Sobrecarga (4 dimensiones)
              </button>
              <button
                onClick={() => loadPreset('length_bias')}
                className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-[11px] font-medium transition"
              >
                ⚠️ Sesgo de Longitud (+165%)
              </button>
              <button
                onClick={() => loadPreset('optimal')}
                className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[11px] font-medium transition"
              >
                ✅ Ítem Óptimo (100 pts)
              </button>
            </div>
          </div>

          {/* Interactive Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Question Draft Editor (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>Editor de Reactivo para Auditoría en Tiempo Real</span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-400">Auditar ítem existente:</span>
                    <select
                      value={selectedItemIdToAudit}
                      onChange={(e) => handleSelectAuditedItem(e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 max-w-[200px] truncate"
                    >
                      <option value="custom">-- Redacción libre / Nuevo --</option>
                      {items.map((it) => (
                        <option key={it.id} value={it.id}>
                          {it.id} - {it.stem?.substring(0, 35)}...
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Stem */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Texto del Enunciado (Stem)</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {auditStem.length} caracteres
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    value={auditStem}
                    onChange={(e) => setAuditStem(e.target.value)}
                    placeholder="Escribe la pregunta o caso práctico..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>

                {/* Legal basis & Item type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Base Legal</label>
                    <input
                      type="text"
                      value={auditLegalBasis}
                      onChange={(e) => setAuditLegalBasis(e.target.value)}
                      placeholder="ej. Art. 53.1 TRLGSS o Art. 167 CE"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Tipo de Actividad</label>
                    <select
                      value={auditItemType}
                      onChange={(e) => setAuditItemType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="cover_and_generate_mcq">Cover & Generate MCQ</option>
                      <option value="spot_error">Spot-the-Error (Falsedad)</option>
                      <option value="cloze">Cloze Recall Drill</option>
                      <option value="two_tier">Two-Tier Diagnostic</option>
                      <option value="contrast_card">Contrast Card</option>
                    </select>
                  </div>
                </div>

                {/* Correct Option */}
                <div className="space-y-1.5 bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl">
                  <label className="text-xs font-semibold text-emerald-300 flex items-center justify-between">
                    <span>Opción Correcta (A)</span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {auditCorrectAnswer.length} chars
                    </span>
                  </label>
                  <input
                    type="text"
                    value={auditCorrectAnswer}
                    onChange={(e) => setAuditCorrectAnswer(e.target.value)}
                    placeholder="Respuesta legalmente correcta y precisa..."
                    className="w-full bg-slate-950 border border-emerald-500/40 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Distractors */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Distractores Competitivos
                  </label>
                  <input
                    type="text"
                    value={auditDistractor1}
                    onChange={(e) => setAuditDistractor1(e.target.value)}
                    placeholder="Distractor B (error plausible del mismo clúster)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={auditDistractor2}
                    onChange={(e) => setAuditDistractor2(e.target.value)}
                    placeholder="Distractor C (trampa temporal / numérica / competencial)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={auditDistractor3}
                    onChange={(e) => setAuditDistractor3(e.target.value)}
                    placeholder="Distractor D (excepción mal aplicada)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Save or apply changes button */}
                <div className="flex items-center justify-between pt-2">
                  {auditSaveStatus && (
                    <span className="text-xs font-medium text-emerald-400 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>{auditSaveStatus}</span>
                    </span>
                  )}
                  <button
                    onClick={handleSaveAuditedItemToBank}
                    className="ml-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {selectedItemIdToAudit !== 'custom'
                        ? 'Actualizar Ítem Corregido'
                        : 'Guardar Ítem Validado'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Real-time Psychometric Audit Panel (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                {/* Score gauge header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Puntuación Psicométrica
                    </span>
                    <span
                      className={`text-2xl font-black ${
                        liveDiagnostic.score >= 80
                          ? 'text-emerald-400'
                          : liveDiagnostic.score >= 60
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {liveDiagnostic.score} / 100
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      liveDiagnostic.rating === 'excelente'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : liveDiagnostic.rating === 'bueno'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : liveDiagnostic.rating === 'necesita_revision'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {liveDiagnostic.rating.replace('_', ' ')}
                  </span>
                </div>

                {/* Specific Diagnostic Checks */}
                <div className="space-y-3">
                  {/* 1. Answer in Stem */}
                  <div
                    className={`p-3.5 rounded-xl border transition ${
                      liveDiagnostic.answerInStem.detected
                        ? 'bg-rose-950/30 border-rose-500/50'
                        : 'bg-slate-950/60 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                        <span>🎯 Pista en el Enunciado</span>
                      </span>
                      {liveDiagnostic.answerInStem.detected ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          DETECTADA
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          LIMPIO
                        </span>
                      )}
                    </div>
                    {liveDiagnostic.answerInStem.detected && (
                      <div className="mt-2 text-xs text-rose-300 space-y-1 leading-relaxed">
                        <p className="text-[11px] text-rose-200">
                          Términos filtrados:{' '}
                          <strong className="underline">
                            "{liveDiagnostic.answerInStem.leakedPhrases.join('", "')}"
                          </strong>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {liveDiagnostic.answerInStem.details}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 2. Overloaded Concepts */}
                  <div
                    className={`p-3.5 rounded-xl border transition ${
                      liveDiagnostic.overloadedConcepts.detected
                        ? 'bg-amber-950/30 border-amber-500/50'
                        : 'bg-slate-950/60 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                        <span>🧠 Sobrecarga Conceptual</span>
                      </span>
                      {liveDiagnostic.overloadedConcepts.detected ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {liveDiagnostic.overloadedConcepts.conceptCount} DIMENSIONES
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          FOCALIZADO
                        </span>
                      )}
                    </div>
                    {liveDiagnostic.overloadedConcepts.detected && (
                      <div className="mt-2 text-xs text-amber-300 space-y-1 leading-relaxed">
                        <p className="text-[11px] text-amber-200">
                          Dimensiones cruzadas:{' '}
                          <span className="font-semibold">
                            {liveDiagnostic.overloadedConcepts.dimensionsFound.join(', ')}
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {liveDiagnostic.overloadedConcepts.details}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 3. Option Length Bias */}
                  <div
                    className={`p-3.5 rounded-xl border transition ${
                      liveDiagnostic.longestOptionBias.detected
                        ? 'bg-indigo-950/30 border-indigo-500/50'
                        : 'bg-slate-950/60 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        📏 Paralelismo y Longitud
                      </span>
                      {liveDiagnostic.longestOptionBias.detected ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                          RATIO {liveDiagnostic.longestOptionBias.ratio}x
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          EQUILIBRADO
                        </span>
                      )}
                    </div>
                    {liveDiagnostic.longestOptionBias.detected && (
                      <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed">
                        {liveDiagnostic.longestOptionBias.details}
                      </p>
                    )}
                  </div>

                  {/* 4. Cliché / Absolute wording */}
                  {liveDiagnostic.absoluteWording.detected && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                      <span className="font-semibold text-amber-400 block">
                        ⚠️ Palabras absolutistas encontradas:
                      </span>
                      <p className="text-[11px] text-slate-400">
                        "{liveDiagnostic.absoluteWording.wordsFound.join('", "')}". Procura
                        evitarlas salvo que la norma use exactamente esa literalidad taxativa.
                      </p>
                    </div>
                  )}
                </div>

                {/* Recommendations list */}
                {liveDiagnostic.recommendations.length > 0 && (
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-emerald-300 block">
                      💡 Sugerencias de Reparación Instruccional
                    </span>
                    <ul className="space-y-1.5">
                      {liveDiagnostic.recommendations.map((rec, idx) => (
                        <li
                          key={idx}
                          className="text-[11px] text-slate-300 flex items-start space-x-1.5"
                        >
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Database-wide Item Audit Scanner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Auditoría de Calidad del Banco Activo ({items.length} Ítems)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Reactivos del banco de preguntas que presentan pistas en el enunciado, sobrecarga
                  conceptual o sesgo de longitud.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300">
                {flaggedBatchItems.length} detectados con advertencias
              </span>
            </div>

            {flaggedBatchItems.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800/80">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                <h4 className="text-sm font-bold text-white">¡Excelente calidad psicométrica!</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Todos los reactivos del banco activo cumplen con los estándares de discriminación,
                  ausencia de pistas directas y focalización atómica.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                {flaggedBatchItems.map(({ item, diag, hasAnswerInStem, hasOverload, hasLengthBias }) => (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-slate-900/60 transition flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                          {item.id}
                        </span>
                        <span className="text-[10px] font-mono text-indigo-400">
                          {item.legal_basis || 'Sin base'}
                        </span>
                        {hasAnswerInStem && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            Pista en Enunciado
                          </span>
                        )}
                        {hasOverload && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Sobrecarga ({diag.overloadedConcepts.conceptCount} dim.)
                          </span>
                        )}
                        {hasLengthBias && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Sesgo Longitud
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-200 font-medium line-clamp-2">
                        {item.stem}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {diag.warnings[0]?.message || diag.recommendations[0]}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-slate-400 block">
                          Calidad
                        </span>
                        <span
                          className={`text-sm font-black ${
                            diag.score >= 80
                              ? 'text-emerald-400'
                              : diag.score >= 60
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {diag.score}/100
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          handleSelectAuditedItem(item.id);
                          window.scrollTo({ top: 200, behavior: 'smooth' });
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Abrir en Editor</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 1. ATOMS LIST & CREATOR */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'atoms' && (
        <div className="space-y-6">
          {/* Quick Manual Creator */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Crear Nueva Proposición Atómica Manual
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newAtomText}
                onChange={(e) => setNewAtomText(e.target.value)}
                placeholder="Proposición legal exacta (ej. Prescripción de 5 años desde día siguiente a hecho causante)"
                className="sm:col-span-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                value={newAtomBasis}
                onChange={(e) => setNewAtomBasis(e.target.value)}
                placeholder="Base Legal (ej. Art. 53.1 TRLGSS)"
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center space-x-3">
                <select
                  value={newAtomType}
                  onChange={(e) => setNewAtomType(e.target.value as AtomType)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  {atomTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <select
                  value={newAtomClusterId}
                  onChange={(e) => setNewAtomClusterId(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 max-w-[200px] truncate"
                >
                  <option value="">-- Sin Cluster --</option>
                  {clusters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={newAtomPairId}
                  onChange={(e) => setNewAtomPairId(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 max-w-[200px] truncate"
                >
                  <option value="">-- Sin Par de Confusión --</option>
                  {confusionPairs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.concept_a} vs {p.concept_b}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCreateManualAtom}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Crear Átomo</span>
              </button>
            </div>
          </div>

          {/* Atoms search bar */}
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar átomos por texto, artículo o tipo..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Mostrando {filteredAtoms.length} de {atoms.length}
            </span>
          </div>

          {/* Grid of Atoms */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredAtoms.map((atom) => (
              <div
                key={atom.id}
                className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono uppercase font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {atom.atom_type || atom.type}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {atom.legal_basis || atom.legal || 'TRLGSS'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{atom.text}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
                  <span className="font-mono">
                    {atom.status === 'validated' ? '✓ Validado' : 'Borrador'}
                  </span>
                  <button
                    onClick={() => handleDeleteAtom(atom.id)}
                    className="text-slate-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. RAPID SET ASSISTANT (1-CLIC SET GENERATION)      */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          {/* Success Banner */}
          {saveSuccessMessage && (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-xs text-emerald-200 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center space-x-3">
                <CheckCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-medium leading-relaxed">{saveSuccessMessage}</span>
              </div>
              <button
                onClick={() => setSaveSuccessMessage(null)}
                className="text-emerald-400 hover:text-white px-2 py-1 rounded text-[11px] font-mono"
              >
                ✕
              </button>
            </div>
          )}

          {/* Configuration & Source Input Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <Wand2 className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">
                    Asistente de Creación Rápida de Sets en 1 Clic
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Convierte texto legal o apuntes en clústeres temáticos, proposiciones atómicas y pares de confusión listos para revisión humana.
                </p>
              </div>

              {/* Destination Topic Selector */}
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-xs text-slate-400 font-medium">Tema destino:</span>
                {!isCreatingNewTopic ? (
                  <div className="flex items-center space-x-1.5">
                    <select
                      value={selectedSetTopicId}
                      onChange={(e) => {
                        if (e.target.value === '__new__') {
                          setIsCreatingNewTopic(true);
                        } else {
                          setSelectedSetTopicId(e.target.value);
                        }
                      }}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 max-w-[200px] truncate"
                    >
                      {topics.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                      <option value="__new__">+ Crear Nuevo Tema...</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-lg border border-amber-500/40">
                    <input
                      type="text"
                      value={newTopicName}
                      onChange={(e) => setNewTopicName(e.target.value)}
                      placeholder="Nombre del nuevo tema"
                      className="bg-transparent text-xs text-white px-2 py-0.5 focus:outline-none w-36"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCreatingNewTopic(false)}
                      className="text-[10px] text-slate-400 hover:text-white px-1.5"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Presets & Legal Reference */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={articleRef}
                onChange={(e) => setArticleRef(e.target.value)}
                placeholder="Referencia Legal / Artículo (ej. Arts. 53 y 54 TRLGSS)"
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
              <div className="sm:col-span-2 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400 mr-1">Preajustes rápidos:</span>
                <button
                  type="button"
                  onClick={() => {
                    setArticleRef('Arts. 53 y 54 TRLGSS');
                    setSourceText(
                      'El derecho al reconocimiento de las prestaciones prescribirá a los cinco años, contados desde el día siguiente a aquel en que tenga lugar el hecho causante de la prestación de que se trate, sin perjuicio de que los efectos de tal reconocimiento se produzcan a partir de los tres meses anteriores a la fecha en que se presente la correspondiente solicitud. El derecho al percibo de las prestaciones a tanto alzado y por una sola vez caducará al año, a contar desde el día siguiente al de haber sido notificada en forma al interesado la concesión de la prestación. Si se trata de prestaciones periódicas, el derecho al percibo de cada mensualidad caducará al año de su respectivo vencimiento.'
                    );
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-[11px] text-slate-300 rounded font-mono transition"
                >
                  Prescripción/Caducidad (53-54)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setArticleRef('Arts. 247 y 249 bis TRLGSS');
                    setSourceText(
                      'Para acreditar los periodos de cotización necesarios para causar derecho a las prestaciones de jubilación, incapacidad permanente, muerte y supervivencia, incapacidad temporal y nacimiento y cuidado de menor, en los contratos fijos-discontinuos se multiplicarán por el coeficiente de 1,5 los días en que el trabajador haya permanecido en alta, sin que en ningún caso pueda computarse un número de días superior al de los días naturales transcurridos. En los contratos de duración determinada de hasta cinco días, cada día de trabajo se considerará como 1,4 días de cotización, sin que en ningún caso la mensualidad pueda superar los días naturales del mes.'
                    );
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-[11px] text-slate-300 rounded font-mono transition"
                >
                  Coeficientes Cómputo (1,5 / 1,4)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setArticleRef('Art. 607 LEC y Art. 44 TRLGSS');
                    setSourceText(
                      'Es inembargable el salario, sueldo, pensión, retribución o su equivalente, que no exceda de la cuantía señalada para el salario mínimo interprofesional. Los salarios, sueldos, jornales, retribuciones o pensiones que sean superiores al SMI se embargarán conforme a la siguiente escala: Para la primera cuantía adicional hasta el doble del SMI, el 30 por 100. Para la cuantía adicional hasta el importe de un tercer SMI, el 50 por 100. Para la cuantía adicional hasta el importe de un cuarto SMI, el 60 por 100. Para la cuantía adicional hasta el importe de un quinto SMI, el 75 por 100. Para cualquier cantidad que exceda de la anterior cuantía, el 90 por 100.'
                    );
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-[11px] text-slate-300 rounded font-mono transition"
                >
                  Escala Embargo SMI
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setArticleRef('Arts. 167 y 168 CE');
                    setSourceText(
                      'Los proyectos de reforma constitucional deberán ser aprobados por una mayoría de tres quintos de cada una de las Cámaras. Aprobada la reforma por las Cortes Generales, será sometida a referéndum para su ratificación cuando así lo soliciten, dentro de los quince días siguientes a su aprobación, una décima parte de los miembros de cualquiera de las Cámaras. Cuando se propusiere la revisión total de la Constitución o una parcial que afecte al Título Preliminar, al Capítulo II, Sección 1ª del Título I, o al Título II, se procederá a la aprobación del principio por mayoría de dos tercios de cada Cámara, y a la disolución inmediata de las Cortes.'
                    );
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-[11px] text-slate-300 rounded font-mono transition"
                >
                  Reforma CE
                </button>
              </div>
            </div>

            {/* Upload file helper */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center space-x-1.5 cursor-pointer text-indigo-400 hover:text-indigo-300 transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Cargar archivo (PDF, TXT, Markdown)</span>
                <input
                  type="file"
                  accept=".txt,.md,.text,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span>{sourceText.length} caracteres | {sourceText.split(/\s+/).filter(Boolean).length} palabras</span>
            </div>

            {/* Offline import pipeline status */}
            {(isImportingPdf || pdfImportError || pdfPages || chunkStatus) && (
              <div className="text-xs space-y-1.5">
                {isImportingPdf && (
                  <div className="flex items-center space-x-2 text-indigo-300">
                    <span className="animate-spin inline-block w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full" />
                    <span>Extrayendo texto del PDF localmente (sin IA, sin conexión)…</span>
                  </div>
                )}
                {pdfImportError && (
                  <div className="p-2.5 bg-rose-950/40 border border-rose-800 rounded-lg text-rose-300">
                    ⚠️ {pdfImportError} — puedes pegar el texto manualmente abajo.
                  </div>
                )}
                {pdfPages && !pdfImportError && (
                  <div className="text-emerald-400">
                    ✓ PDF procesado: {pdfPages.length} páginas extraídas localmente. Los fragmentos conservarán la referencia de página.
                  </div>
                )}
                {chunkStatus && <div className="text-slate-300">{chunkStatus}</div>}
              </div>
            )}

            {/* Source Text Input */}
            <textarea
              rows={7}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Pega aquí el texto normativo del BOE, diapositivas o apuntes del temario de oposición..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans leading-relaxed"
            />

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                <BrainCircuit className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Genera clústeres conceptuales/numéricos, átomos con tipos psicométricos y pares de interferencia.
                </span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSuggestAtomsOffline}
                  disabled={isSuggestingOffline || !sourceText.trim()}
                  title="Detección por marcadores léxicos (plazos, porcentajes, excepciones, órganos…). Sin IA, sin API key."
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 disabled:opacity-50 text-cyan-300 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isSuggestingOffline ? 'Analizando…' : 'Sugerir átomos (sin IA)'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCreateChunks}
                  disabled={isCreatingChunks || !sourceText.trim()}
                  title="Divide el texto en fragmentos con referencia de artículo y página"
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 disabled:opacity-50 text-slate-300 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isCreatingChunks ? 'Creando…' : 'Crear fragmentos'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleExtractAtoms}
                  disabled={isExtracting || !sourceText.trim()}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 disabled:opacity-50 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Solo Átomos
                </button>
                <button
                  type="button"
                  onClick={handleExtractFullSet}
                  disabled={isExtracting || !sourceText.trim()}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 rounded-md text-xs font-bold transition flex items-center space-x-2 shadow-sm"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>{isExtracting ? 'Analizando texto normativo...' : 'Generar Set Completo en 1 Clic'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Unified Extracted Set Approval Workspace */}
          {extractedSet && (
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-5 shadow-lg animate-in fade-in duration-300">
              {/* Top Approval Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px] font-mono uppercase font-bold">
                      Set Pendiente de Validación
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Base: {extractedSet.detectedLegalBasis}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{extractedSet.summary}</h4>
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
                    <span className="px-2 py-0.5 bg-slate-800 rounded">
                      📦 <strong>{extractedSet.clusters.filter((c) => c.selected).length}</strong> / {extractedSet.clusters.length} Clústeres
                    </span>
                    <span className="px-2 py-0.5 bg-slate-800 rounded">
                      ⚡ <strong>{extractedSet.atoms.filter((a) => a.selected).length}</strong> / {extractedSet.atoms.length} Átomos
                    </span>
                    <span className="px-2 py-0.5 bg-slate-800 rounded">
                      ⚖️ <strong>{extractedSet.confusionPairs.filter((p) => p.selected).length}</strong> / {extractedSet.confusionPairs.length} Pares de Confusión
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setExtractedSet(null);
                      setDraftedAtoms([]);
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-400 text-xs rounded-xl transition"
                  >
                    Descartar Todo
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveFullSet}
                    disabled={isSavingFullSet}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-md"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>{isSavingFullSet ? 'Guardando en Base de Datos...' : 'Aprobar y Guardar Set Completo en 1 Clic'}</span>
                  </button>
                </div>
              </div>

              {/* Subtabs to inspect & customize components */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setActiveSetSubTab('atoms')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      activeSetSubTab === 'atoms'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Átomos ({extractedSet.atoms.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSetSubTab('clusters')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      activeSetSubTab === 'clusters'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Clústeres Temáticos ({extractedSet.clusters.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSetSubTab('confusion_pairs')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      activeSetSubTab === 'confusion_pairs'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Pares de Confusión ({extractedSet.confusionPairs.length})
                  </button>
                </div>

                {activeSetSubTab === 'atoms' && (
                  <div className="flex items-center space-x-3 text-xs">
                    <select
                      value={setFilterCluster}
                      onChange={(e) => setSetFilterCluster(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 text-xs focus:outline-none"
                    >
                      <option value="all">Todos los Clústeres</option>
                      {extractedSet.clusters.map((c) => (
                        <option key={c.temp_id} value={c.temp_id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const allSelected = extractedSet.atoms.every((a) => a.selected);
                        setExtractedSet({
                          ...extractedSet,
                          atoms: extractedSet.atoms.map((a) => ({ ...a, selected: !allSelected })),
                        });
                      }}
                      className="text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      {extractedSet.atoms.every((a) => a.selected) ? 'Deseleccionar todos' : 'Seleccionar todos'}
                    </button>
                  </div>
                )}
              </div>

              {/* Subtab: Atoms */}
              {activeSetSubTab === 'atoms' && (
                <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                  {extractedSet.atoms
                    .filter((a) => setFilterCluster === 'all' || a.temp_cluster_id === setFilterCluster)
                    .map((atom, idx) => {
                      const associatedCluster = extractedSet.clusters.find(
                        (c) => c.temp_id === atom.temp_cluster_id
                      );
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border transition flex items-start justify-between gap-3 ${
                            atom.selected
                              ? 'bg-slate-950/90 border-slate-750'
                              : 'bg-slate-950/40 border-slate-850 opacity-60'
                          }`}
                        >
                          <div className="flex items-start space-x-3 pt-0.5">
                            <input
                              type="checkbox"
                              checked={atom.selected}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setExtractedSet({
                                  ...extractedSet,
                                  atoms: extractedSet.atoms.map((a, i) =>
                                    i === idx ? { ...a, selected: checked } : a
                                  ),
                                });
                              }}
                              className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                            />
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                                  {atom.atom_type}
                                </span>
                                <span className="text-[11px] font-mono text-slate-400">
                                  {atom.legal_basis || extractedSet.detectedLegalBasis}
                                </span>
                                {associatedCluster && (
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                                    Clúster: {associatedCluster.name}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-200 leading-relaxed">{atom.text}</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              handleSaveDraftedAtom(atom, idx);
                              setExtractedSet({
                                ...extractedSet,
                                atoms: extractedSet.atoms.filter((_, i) => i !== idx),
                              });
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 rounded text-[11px] font-medium transition shrink-0"
                          >
                            Guardar solo este
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Subtab: Clusters */}
              {activeSetSubTab === 'clusters' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {extractedSet.clusters.map((cluster, idx) => (
                    <div
                      key={cluster.temp_id || idx}
                      className={`p-3.5 rounded-xl border transition space-y-2 ${
                        cluster.selected
                          ? 'bg-slate-950/90 border-slate-750'
                          : 'bg-slate-950/40 border-slate-850 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cluster.selected}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setExtractedSet({
                                ...extractedSet,
                                clusters: extractedSet.clusters.map((c, i) =>
                                  i === idx ? { ...c, selected: checked } : c
                                ),
                              });
                            }}
                            className="rounded border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-white">{cluster.name}</span>
                        </label>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                          {cluster.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{cluster.description}</p>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Prioridad: {cluster.priority} | Átomos vinculados:{' '}
                        {extractedSet.atoms.filter((a) => a.temp_cluster_id === cluster.temp_id).length}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Subtab: Confusion Pairs */}
              {activeSetSubTab === 'confusion_pairs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {extractedSet.confusionPairs.map((cp, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border transition space-y-2 ${
                        cp.selected
                          ? 'bg-slate-950/90 border-slate-750'
                          : 'bg-slate-950/40 border-slate-850 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cp.selected}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setExtractedSet({
                                ...extractedSet,
                                confusionPairs: extractedSet.confusionPairs.map((p, i) =>
                                  i === idx ? { ...p, selected: checked } : p
                                ),
                              });
                            }}
                            className="rounded border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-indigo-300">{cp.concept_a}</span>
                          <span className="text-[10px] text-slate-500 font-mono">vs</span>
                          <span className="text-xs font-bold text-amber-300">{cp.concept_b}</span>
                        </label>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300">
                          {cp.severity || 'high'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        <strong className="text-slate-400">Discriminante: </strong>
                        {cp.discriminating_cue}
                      </p>
                      <p className="text-[11px] text-rose-400/90">
                        <strong className="text-rose-400">Trampa MCQ: </strong>
                        {cp.common_trap}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Simple drafted atoms list (if user ran 'Solo Átomos' without full set) */}
          {!extractedSet && draftedAtoms.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Átomos Sugeridos Pendientes de Validación ({draftedAtoms.length})
                </h3>
                <button
                  type="button"
                  onClick={async () => {
                    for (let i = 0; i < draftedAtoms.length; i++) {
                      await handleSaveDraftedAtom(draftedAtoms[i], i);
                    }
                  }}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition"
                >
                  Aprobar Todos
                </button>
              </div>
              <div className="space-y-2">
                {draftedAtoms.map((atom, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-900 border border-amber-500/30 rounded-xl flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          {atom.atom_type}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {atom.legal_basis}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200">{atom.text}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleSaveDraftedAtom(atom, idx)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => setDraftedAtoms((prev) => prev.filter((_, i) => i !== idx))}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-400 text-xs rounded-lg transition"
                      >
                        Descartar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. CLUSTERS */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'clusters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clusters.map((c) => {
            const count = atoms.filter((a) => a.cluster_id === c.id).length;
            return (
              <div
                key={c.id}
                className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono uppercase font-semibold bg-indigo-500/20 text-indigo-300">
                    {c.type}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-slate-800 text-slate-300">
                    Prioridad: {c.priority}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{c.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{c.description}</p>
                <div className="pt-2 text-[11px] text-slate-500 font-mono">
                  {count} átomos asociados
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. CONFUSION PAIRS */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'confusion_pairs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {confusionPairs.map((cp) => (
            <div
              key={cp.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-indigo-300">{cp.concept_a}</span>
                  <span className="text-xs font-mono text-slate-500">vs</span>
                  <span className="text-sm font-bold text-amber-300">{cp.concept_b}</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-semibold ${
                    cp.severity === 'critical'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {cp.severity}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg text-xs space-y-1.5 border border-slate-850">
                <p className="text-slate-300">
                  <span className="font-semibold text-slate-400">Criterio discriminante: </span>
                  {cp.discriminating_cue}
                </p>
                <p className="text-rose-400/90">
                  <span className="font-semibold">Trampa común: </span>
                  {cp.common_trap}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                  <span>Base A: {cp.legal_basis_a}</span>
                  <span>Base B: {cp.legal_basis_b}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
