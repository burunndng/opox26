import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import {
  Send,
  Paperclip,
  Globe,
  Bot,
  User,
  Scale,
  Brain,
  FileText,
  FileCode,
  X,
  Plus,
  Trash2,
  Download,
  ExternalLink,
  Check,
  Play,
  BookmarkPlus,
  RefreshCw,
  Search,
  Sliders,
  ChevronDown,
  Info,
  HelpCircle,
  FileUp,
  Cpu,
  Zap,
  Target,
} from 'lucide-react';
import {
  ChatMessage,
  ChatAttachment,
  GroundingCitation,
  Item,
  Atom,
  Topic,
  Cluster,
  ConfusionPair,
} from '../types.ts';
import { api } from '../api.ts';

interface AiChatbotProps {
  topics: Topic[];
  clusters: Cluster[];
  confusionPairs: ConfusionPair[];
  onItemCreated?: () => void;
  onAtomCreated?: () => void;
  onPracticeItem?: (item: Item) => void;
}

interface SavedConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  model: string;
  enableWebSearch: boolean;
  systemInstruction?: string;
  messages: ChatMessage[];
}

const MODEL_OPTIONS = [
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    desc: 'Modelo de referencia para texto, análisis normativo y Búsqueda Web (Recomendado)',
    badge: 'Recomendado',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    desc: 'Respuesta ultra rápida y bajo consumo de cuota para generación ágil',
    badge: 'Rápido',
  },
  {
    id: 'gemini-flash-latest',
    name: 'Gemini Flash Latest',
    desc: 'Versión continua más reciente del modelo Flash',
    badge: 'Actualizado',
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro',
    desc: 'Razonamiento normativo profundo y jurisprudencial (Requiere plan de pago)',
    badge: 'Pro',
  },
];

const SYSTEM_ROLES = [
  {
    name: 'Tutor Spaced-Retrieval C1 Seguridad Social (1616)',
    instruction: `Eres un tutor de recuperación espaciada para un opositor que prepara el Cuerpo Administrativo de la Administración de la Seguridad Social (C1, código 1616, turno libre).
No eres un explicador pasivo por defecto; eres un motor de recuperación activa generativa.
Estructura del examen: Parte 1 tipo test (70+3 reserva, penalización de -1/4 por error, 0 en blanco).
Patrón de fallo diagnosticado: reglamentos del Anexo I.B (RD 84/1996, RD 1415/2004, RD 2064/1995), atribución competencial TGSS/INSS y plazos/cifras de los temas 4, 5, 6, 7, 9 y 12.
Directiva principal: Haz que el opositor produzca la respuesta de memoria ANTES de dar cualquier explicación. Exige estimación de confianza (0-100%). Si la confianza es alta (>70%) y falla, resáltalo como un error de calibración scoring-critical debido a la penalización de -1/4.`,
  },
  {
    name: 'Preparador Experto Seguridad Social',
    instruction: `Eres el preparador de élite y diseñador instruccional psicométrico de OposiLab MCQ Trainer para oposiciones de la Administración Pública Española, especializado en el Texto Refundido de la Ley General de la Seguridad Social (TRLGSS). Tu objetivo es ayudar al opositor a dominar el temario mediante actividades cognitivas de alta discriminación, descarte de distractores, análisis de trampas y recuperación generativa activa, evitando la relectura pasiva y los simulacros memorísticos.`,
  },
  {
    name: 'Diseñador Psicométrico de Ítems',
    instruction: `Eres un psicometrista especializado en el diseño de reactivos de selección múltiple (MCQ) para oposiciones tipo test en España. Cada distractor que propongas debe explotar un error cognitivo real (sustitución numérica, confusión temporal, órgano incompetente, etc.) y tener una justificación rigurosa citando el artículo exacto del TRLGSS.`,
  },
  {
    name: 'Auditor de Trampas y Novedades BOE',
    instruction: `Eres un auditor legal de Seguridad Social enfocado en cazar trampas normativas, discrepancias entre normas generales y excepciones, y las últimas actualizaciones legislativas y revalorizaciones publicadas en el BOE para 2026.`,
  },
];

const QUICK_PROMPTS = [
  {
    label: 'Micro-Drill C1: Plazos y Órganos (Con Calibración)',
    prompt:
      'Lanza un micro-drill de recuperación activa sobre plazos críticos o competencias TGSS/INSS (RD 84/1996, RD 1415/2004 o TRLGSS). Pregúntame un dato de memoria y pídeme mi estimación de confianza antes de evaluar.',
  },
  {
    label: 'Generar 3 MCQs de Alta Discriminación',
    prompt:
      'A partir del tema o documento adjunto, genera 3 ejercicios tipo Cover-and-Generate MCQ de alta discriminación sobre los puntos más susceptibles de trampa en examen (TRLGSS). Incluye autopsia completa de cada distractor con su tipo de trampa y condición de validez.',
  },
  {
    label: 'Extraer Átomos Numéricos y Plazos',
    prompt:
      'Extrae todas las magnitudes numéricas, plazos, porcentajes y cuantías del tema o texto en forma de proposiciones atómicas con su base legal exacta.',
  },
  {
    label: 'Crear Contrast Card (Pares de Confusión)',
    prompt:
      'Identifica el par de conceptos más confuso de este contenido (por ejemplo prescripción vs caducidad, o automaticidad absoluta vs relativa) y crea una Contrast Card completa con criterio discriminatorio y mini-caso práctico.',
  },
  {
    label: 'Diseñar Spot-the-Error (Detección de Falsedad)',
    prompt:
      'Crea un ejercicio de Spot-the-Error que contenga exactamente un error sutil (sustitución numérica, órgano incompetente o excepción omitida) e indica la corrección exacta y la trampa.',
  },
  {
    label: 'Constitución 1978: Micro-Test Art. 9.3 y Reforma',
    prompt:
      'Hazme una pregunta directa de memoria sobre los principios del Art. 9.3 de la Constitución Española o sobre las mayorías y plazos de reforma constitucional (Art. 167 vs 168). Pídeme mi confianza antes de dar la solución.',
  },
  {
    label: 'Buscar Novedades y Revalorizaciones 2026',
    prompt:
      'Utiliza la búsqueda web para consultar las cuantías máximas de pensiones, límites de ingresos de complementos a mínimos y revalorizaciones oficiales de Seguridad Social para 2026 y genera un ejercicio de test.',
  },
];

export const AiChatbot: React.FC<AiChatbotProps> = ({
  topics,
  clusters,
  confusionPairs,
  onItemCreated,
  onAtomCreated,
  onPracticeItem,
}) => {
  const [conversations, setConversations] = useState<SavedConversation[]>(() => {
    try {
      const saved = localStorage.getItem('oposilab_chat_conversations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeChatId, setActiveChatId] = useState<string>(() => {
    return 'default_chat';
  });

  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [useOpenRouter, setUseOpenRouter] = useState<boolean>(() => {
    try {
      return localStorage.getItem('oposilab_use_openrouter') === 'true';
    } catch {
      return false;
    }
  });
  const [enableWebSearch, setEnableWebSearch] = useState<boolean>(true);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);
  const [customSystemPrompt, setCustomSystemPrompt] = useState<string>(
    SYSTEM_ROLES[0].instruction
  );
  const [showConfig, setShowConfig] = useState<boolean>(false);

  const handleToggleOpenRouter = () => {
    const next = !useOpenRouter;
    setUseOpenRouter(next);
    try {
      localStorage.setItem('oposilab_use_openrouter', String(next));
    } catch {}
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome_1',
        role: 'model',
        content: `👋 **¡Hola opositor! Soy tu Asistente y Preparador Cognitivo OposiLab.**

Estoy especializado en el **Texto Refundido de la Ley General de la Seguridad Social (TRLGSS)** y en la metodología de discriminación jurídica de alta precisión.

### ¿En qué puedo ayudarte hoy?
1. **Analizar tus temas o documentos:** Sube o arrastra un **PDF, Markdown (.md), texto o esquema**, y lo descompondré en proposiciones jurídicas.
2. **Generar ejercicios del método OposiLab:** Cover-and-Generate MCQs, Cloze, Contrast Cards, Spot-the-Error o laboratorios de casos.
3. **Búsqueda Web en tiempo real:** Activada con **Google Search** para verificar las últimas cuantías, topes y normativa actualizada para 2026.
4. **Incorporación con un clic:** Cualquier ejercicio o átomo que genere puede guardarse directamente en tu **Banco de Ítems** local para entrar en la cola de repaso espaciado.

*Puedes elegir una de las sugerencias rápidas de abajo o adjuntar tu propio tema para comenzar.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.8-flash',
      },
    ];
  });

  const [inputText, setInputText] = useState<string>('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [importedItems, setImportedItems] = useState<Set<string>>(new Set());
  const [importedAtoms, setImportedAtoms] = useState<Set<string>>(new Set());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Save conversations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('oposilab_chat_conversations', JSON.stringify(conversations));
    } catch {
      // Ignored
    }
  }, [conversations]);

  const handleRoleChange = (index: number) => {
    setSelectedRoleIndex(index);
    setCustomSystemPrompt(SYSTEM_ROLES[index].instruction);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase();
      const id = 'att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

      if (ext === 'pdf') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setAttachments((prev) => [
            ...prev,
            {
              id,
              name: file.name,
              type: 'pdf',
              size: file.size,
              mimeType: 'application/pdf',
              data: result,
            },
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        // Text, Markdown, CSV, JSON
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          const docType =
            ext === 'md'
              ? 'md'
              : ext === 'json'
                ? 'json'
                : ext === 'csv'
                  ? 'csv'
                  : 'txt';
          setAttachments((prev) => [
            ...prev,
            {
              id,
              name: file.name,
              type: docType,
              size: file.size,
              mimeType: file.type || 'text/plain',
              textContent: text,
            },
          ]);
        };
        reader.readAsText(file);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!content && attachments.length === 0) return;

    const userMessage: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: content || 'Por favor, analiza el documento adjunto y propón actividades de estudio.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setAttachments([]);
    setIsLoading(true);

    try {
      const response = await api.aiChat({
        messages: newMessages,
        provider: useOpenRouter ? 'openrouter' : 'gemini',
        model: useOpenRouter ? 'openrouter/free' : selectedModel,
        enableWebSearch: useOpenRouter ? false : enableWebSearch,
        systemInstruction: customSystemPrompt,
      });

      const assistantMessage: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        role: 'model',
        content: response.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: response.citations,
        searchQueries: response.searchQueries,
        modelUsed: response.modelUsed,
        extractedItems: response.extractedItems,
        extractedAtoms: response.extractedAtoms,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errMsg = String(err.message || err || '');
      const isQuota =
        errMsg.includes('429') ||
        errMsg.includes('RESOURCE_EXHAUSTED') ||
        errMsg.includes('quota') ||
        errMsg.includes('rate-limit');

      const errorMessage: ChatMessage = {
        id: 'msg_err_' + Date.now(),
        role: 'model',
        content: isQuota
          ? `⚠️ **Límite de Cuota de Gemini API Alcanzado (Error 429 RESOURCE_EXHAUSTED)**\n\nTu clave de API de Gemini ha consumido la cuota gratuita por minuto o mensual del proveedor.\n\n💡 **Alternativas directas para continuar:**\n1. **Activa OpenRouter:** Pulsa el botón **OpenRouter (openrouter/free)** en la barra superior para continuar generando ítems gratis sin consumir cuota de Gemini.\n2. **Modo local:** OposiLab puede seguir estructurando ejercicios con el motor cognitivo local sin requerir conexión externa.`
          : `⚠️ **Ha ocurrido un problema al comunicar con el servicio:**\n\n${errMsg}\n\n*Si estás usando tu propia clave, asegúrate de que esté configurada correctamente en el archivo \`.env\`.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: isQuota ? 'Cuota de API agotada (429)' : 'Error de conexión',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImportItem = async (item: Partial<Item>, key: string) => {
    setImportingId(key);
    try {
      const defaultCluster = clusters[0]?.id || 'cluster_prescripcion_caducidad';
      const defaultPair = confusionPairs[0]?.id || 'pair_prescripcion_caducidad';
      const itemToSave = {
        ...item,
        topic_id: item.topic_id || topics[0]?.id || 'tema_7_seguridad_social',
        cluster_id: item.cluster_id || defaultCluster,
        confusion_pair_id: item.confusion_pair_id || defaultPair,
        status: 'draft' as const,
        source: 'ai_draft' as const,
      };
      await api.createItem(itemToSave as any);
      setImportedItems((prev) => new Set(prev).add(key));
      onItemCreated?.();
    } catch (err: any) {
      alert(`Error al guardar ítem: ${err.message}`);
    } finally {
      setImportingId(null);
    }
  };

  const handleImportAtom = async (atom: Partial<Atom>, key: string) => {
    setImportingId(key);
    try {
      const atomToSave = {
        ...atom,
        topic_id: atom.topic_id || topics[0]?.id || 'tema_7_seguridad_social',
        status: 'draft' as const,
      };
      await api.createAtom(atomToSave as any);
      setImportedAtoms((prev) => new Set(prev).add(key));
      onAtomCreated?.();
    } catch (err: any) {
      alert(`Error al guardar átomo: ${err.message}`);
    } finally {
      setImportingId(null);
    }
  };

  const handlePracticeExtractedItem = (item: Partial<Item>) => {
    const fullItem: Item = {
      id: 'temp_' + Date.now(),
      stem: item.stem || 'Pregunta generada por IA',
      item_type: item.item_type || 'cover_and_generate_mcq',
      prompt_before_options:
        item.prompt_before_options ||
        'Escribe de memoria la regla o plazo antes de ver las alternativas.',
      correct_answer: item.correct_answer || 'A',
      legal_basis: item.legal_basis || 'TRLGSS',
      rule_statement: item.rule_statement || '',
      why_correct: item.why_correct || '',
      corrective_rule: item.corrective_rule || '',
      options: item.options || [],
      difficulty: item.difficulty || 2,
      topic_id: item.topic_id || topics[0]?.id || 'tema_7_seguridad_social',
      status: 'draft',
      source: 'ai_draft',
      cognitive_operations: item.cognitive_operations || ['generative_retrieval'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onPracticeItem?.(fullItem);
  };

  const handleClearChat = () => {
    if (window.confirm('¿Deseas vaciar el historial de esta conversación?')) {
      setMessages([
        {
          id: 'welcome_new',
          role: 'model',
          content: 'Conversación reiniciada. Puedes escribir tu consulta o adjuntar un documento (PDF, Markdown, texto) para generar actividades.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleExportChat = () => {
    const md = messages
      .map((m) => {
        const sender = m.role === 'user' ? '### 👤 Opositor' : '### 🤖 Preparador OposiLab';
        return `${sender} (${m.timestamp})\n\n${m.content}\n\n---`;
      })
      .join('\n\n');

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oposilab-chat-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="ai-chatbot-container" className="flex flex-col h-[calc(100vh-140px)] min-h-[550px] bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-stone-50 border-b border-stone-200 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md flex items-center justify-center font-bold bg-amber-500/10 border border-amber-500/30 text-amber-700">
            {useOpenRouter ? (
              <Cpu className="w-5 h-5 text-amber-700" />
            ) : (
              <Scale className="w-5 h-5 text-amber-700" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-stone-900 tracking-tight">
                {useOpenRouter ? 'Asistente Normativo (OpenRouter)' : 'Asistente Normativo & Preparador'}
              </h2>
              <span className="text-slate-400 text-xs" aria-hidden="true">·</span>
              <span className="font-mono text-xs text-stone-600">
                {useOpenRouter ? 'openrouter/free' : 'Búsqueda Web & Multimodal'}
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Analiza temas, extrae proposiciones de alta interferencia y genera reactivos de discriminación
            </p>
          </div>
        </div>

        {/* Model, Provider, WebSearch, and Config toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* OpenRouter Provider Toggle Mini-Card */}
          <button
            type="button"
            onClick={handleToggleOpenRouter}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shadow-2xs cursor-pointer ${
              useOpenRouter
                ? 'bg-purple-50 text-purple-900 border-purple-300 ring-2 ring-purple-400/30'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
            title={
              useOpenRouter
                ? 'OpenRouter ACTIVO: usando modelo openrouter/free (haz clic para alternar a Gemini)'
                : 'Alternar proveedor a OpenRouter (modelo openrouter/free sin cuota de Gemini)'
            }
          >
            <Cpu className={`w-3.5 h-3.5 ${useOpenRouter ? 'text-purple-600 animate-pulse' : 'text-stone-400'}`} />
            <div className="flex items-center gap-1.5">
              <span>OpenRouter</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold tracking-tight ${
                  useOpenRouter ? 'bg-purple-200 text-purple-950' : 'bg-stone-100 text-stone-500'
                }`}
              >
                openrouter/free
              </span>
            </div>
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                useOpenRouter ? 'bg-purple-600 ring-2 ring-purple-300' : 'bg-stone-300'
              }`}
            />
          </button>

          {/* Web search toggle (only applicable for Gemini) */}
          {!useOpenRouter && (
            <button
              type="button"
              onClick={() => setEnableWebSearch(!enableWebSearch)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors shadow-2xs ${
                enableWebSearch
                  ? 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
              title="Activa Google Search Grounding para información actualizada del BOE y Seguridad Social"
            >
              <Globe className={`w-3.5 h-3.5 ${enableWebSearch ? 'text-blue-600 animate-pulse' : 'text-stone-400'}`} />
              <span>Búsqueda Web</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  enableWebSearch ? 'bg-blue-600' : 'bg-stone-300'
                }`}
              />
            </button>
          )}

          {/* Model selector dropdown or OpenRouter indicator */}
          {useOpenRouter ? (
            <div
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-purple-100/70 text-purple-900 border border-purple-300 rounded-lg px-2.5 py-1.5 shadow-2xs"
              title="Modelo activo en OpenRouter: openrouter/free"
            >
              <Zap className="w-3.5 h-3.5 text-purple-600" />
              <span className="font-semibold">openrouter/free</span>
              <span className="text-[10px] bg-purple-200 text-purple-950 font-bold px-1.5 py-0.2 rounded">Gratuito</span>
            </div>
          ) : (
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="text-xs font-medium bg-white text-stone-800 border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs cursor-pointer"
              >
                {MODEL_OPTIONS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.badge})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Config & action buttons */}
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className={`p-1.5 rounded-lg border transition-colors ${
              showConfig
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
            title="Configurar rol del asistente y parámetros"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleExportChat}
            className="p-1.5 rounded-lg bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 transition-colors"
            title="Descargar conversación como archivo Markdown"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleClearChat}
            className="p-1.5 rounded-lg bg-white text-stone-600 border border-stone-200 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Limpiar mensajes"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Configuration Drawer */}
      {showConfig && (
        <div className="bg-amber-50/70 border-b border-amber-200/80 px-5 py-3 text-xs text-stone-800 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-stone-900 block mb-1">
                Rol e Instrucción del Sistema:
              </label>
              <div className="flex gap-2 mb-2">
                {SYSTEM_ROLES.map((r, idx) => (
                  <button
                    key={r.name}
                    type="button"
                    onClick={() => handleRoleChange(idx)}
                    className={`px-2.5 py-1 rounded-md border font-medium transition-colors ${
                      selectedRoleIndex === idx
                        ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
              <textarea
                value={customSystemPrompt}
                onChange={(e) => setCustomSystemPrompt(e.target.value)}
                rows={2}
                className="w-full text-xs font-mono bg-white border border-stone-300 rounded-md p-2 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                placeholder="Instrucción del sistema personalizada..."
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <label className="font-bold text-stone-900 block mb-1">
                  Capacidades Activas:
                </label>
                <ul className="space-y-1 text-stone-600">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      <strong>Proveedor Activo:</strong>{' '}
                      {useOpenRouter ? (
                        <span className="text-purple-700 font-bold">OpenRouter (openrouter/free)</span>
                      ) : (
                        <span className="text-amber-800 font-bold">Google Gemini ({selectedModel})</span>
                      )}
                    </span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      <strong>Google Search Grounding:</strong> {enableWebSearch && !useOpenRouter ? 'Habilitado (Google Search)' : 'Desactivado'}
                    </span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      <strong>Ingestión Documental:</strong> PDF nativo (vía inlineData), Markdown, TXT y CSV.
                    </span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      <strong>Autopsia de Distractores:</strong> Clasificación automática de trampas (E1-E20).
                    </span>
                  </li>
                </ul>
              </div>
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowConfig(false)}
                  className="text-xs text-stone-600 hover:text-stone-900 font-semibold underline"
                >
                  Cerrar ajustes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages Thread */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-stone-50/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 max-w-4xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-2xs font-semibold text-xs ${
                msg.role === 'user'
                  ? 'bg-stone-800 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {msg.role === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>

            {/* Bubble */}
            <div className={`flex flex-col gap-1.5 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`rounded-2xl px-4 py-3.5 text-sm leading-relaxed shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-stone-900 text-stone-50 rounded-tr-xs'
                    : 'bg-white text-stone-900 border border-stone-200 rounded-tl-xs'
                }`}
              >
                {/* User Attachments display */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2.5 pb-2.5 border-b border-stone-700/50">
                    {msg.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-800 text-stone-200 text-xs font-mono border border-stone-700"
                      >
                        {att.type === 'pdf' ? (
                          <FileText className="w-3.5 h-3.5 text-red-400" />
                        ) : (
                          <FileCode className="w-3.5 h-3.5 text-blue-400" />
                        )}
                        <span className="font-semibold truncate max-w-[150px]">{att.name}</span>
                        <span className="text-[10px] text-stone-400">
                          ({(att.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Markdown text */}
                <div className={msg.role === 'user' ? 'text-stone-100 prose-invert' : 'text-stone-900'}>
                  <Markdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li>{children}</li>,
                      h3: ({ children }) => <h3 className="text-sm font-bold mt-3 mb-1 text-stone-900">{children}</h3>,
                      h4: ({ children }) => <h4 className="text-xs font-bold mt-2 mb-1 text-stone-900">{children}</h4>,
                      code: ({ children }) => (
                        <code className="font-mono text-xs bg-stone-100 text-amber-800 px-1 py-0.5 rounded">
                          {children}
                        </code>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-3 border-amber-500 pl-3 my-2 text-stone-600 italic text-xs">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {msg.content}
                  </Markdown>
                </div>

                {/* Grounding / Web Search Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600 mb-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      <span>Fuentes verificadas por Google Search:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((cite, idx) => (
                        <a
                          key={idx}
                          href={cite.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-blue-50/80 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors"
                        >
                          <span className="truncate max-w-[220px] font-medium">{cite.title}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actionable Cards for Extracted Items */}
              {msg.extractedItems && msg.extractedItems.length > 0 && (
                <div className="w-full mt-2 space-y-2">
                  <div className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-600" />
                    <span>Ejercicios generados listos para incorporar:</span>
                  </div>
                  {msg.extractedItems.map((item, idx) => {
                    const itemKey = `${msg.id}_item_${idx}`;
                    const isImported = importedItems.has(itemKey);
                    return (
                      <div
                        key={idx}
                        className="bg-white border border-amber-200 rounded-xl p-3.5 shadow-2xs hover:border-amber-400 transition-all flex flex-col gap-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-100 text-amber-800 border border-amber-300 mb-1">
                              {item.item_type || 'cover_and_generate_mcq'}
                            </span>
                            <p className="text-xs font-semibold text-stone-900 leading-snug">
                              {item.stem}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono text-stone-500 shrink-0 bg-stone-100 px-1.5 py-0.5 rounded">
                            {item.legal_basis || 'TRLGSS'}
                          </span>
                        </div>

                        {item.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-stone-700 bg-stone-50 p-2 rounded-lg border border-stone-100">
                            {item.options.map((opt: any) => (
                              <div
                                key={opt.id}
                                className={`px-2 py-1 rounded flex items-center gap-1.5 ${
                                  opt.is_correct
                                    ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200'
                                    : 'bg-white text-stone-600 border border-stone-200'
                                }`}
                              >
                                <span className="font-bold">{opt.id})</span>
                                <span className="truncate">{opt.text}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1 gap-2 border-t border-stone-100">
                          <span className="text-[11px] text-stone-500 italic truncate">
                            Base: {item.legal_basis}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handlePracticeExtractedItem(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
                            >
                              <Play className="w-3 h-3 text-amber-700" />
                              <span>Practicar ahora</span>
                            </button>
                            <button
                              type="button"
                              disabled={isImported || importingId === itemKey}
                              onClick={() => handleImportItem(item, itemKey)}
                              className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-md transition-colors shadow-2xs ${
                                isImported
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-600 hover:bg-amber-700 text-white'
                              }`}
                            >
                              {isImported ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-700" />
                                  <span>Guardado</span>
                                </>
                              ) : (
                                <>
                                  <BookmarkPlus className="w-3 h-3" />
                                  <span>Importar a Banco</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Actionable Cards for Extracted Atoms */}
              {msg.extractedAtoms && msg.extractedAtoms.length > 0 && (
                <div className="w-full mt-2 space-y-2">
                  <div className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-teal-600" />
                    <span>Átomos normativos identificados:</span>
                  </div>
                  {msg.extractedAtoms.map((atom, idx) => {
                    const atomKey = `${msg.id}_atom_${idx}`;
                    const isImported = importedAtoms.has(atomKey);
                    return (
                      <div
                        key={idx}
                        className="bg-white border border-teal-200 rounded-xl p-3 shadow-2xs hover:border-teal-400 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-teal-50 text-teal-800 border border-teal-200 uppercase">
                              {atom.atom_type || 'norma'}
                            </span>
                            <span className="font-mono text-[10px] text-stone-500">
                              {atom.legal_basis}
                            </span>
                          </div>
                          <p className="text-stone-900 font-medium">{atom.text}</p>
                        </div>
                        <button
                          type="button"
                          disabled={isImported || importingId === atomKey}
                          onClick={() => handleImportAtom(atom, atomKey)}
                          className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                            isImported
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-teal-600 hover:bg-teal-700 text-white'
                          }`}
                        >
                          {isImported ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Guardado</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>Guardar Átomo</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Timestamp & Model Badge */}
              <div className="flex items-center gap-2 text-[10px] text-stone-400 px-1">
                <span>{msg.timestamp}</span>
                {msg.modelUsed && (
                  <span className="font-mono bg-stone-100 px-1.5 py-0.2 rounded text-stone-500">
                    {msg.modelUsed}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3.5 max-w-4xl mr-auto">
            <div className={`w-8 h-8 rounded-full ${useOpenRouter ? 'bg-purple-600' : 'bg-amber-600'} text-white flex items-center justify-center shrink-0 shadow-2xs font-semibold text-xs`}>
              {useOpenRouter ? <Cpu className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4 animate-spin" />}
            </div>
            <div className="bg-white text-stone-800 border border-stone-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-medium text-stone-600">
                <RefreshCw className={`w-3.5 h-3.5 ${useOpenRouter ? 'text-purple-600' : 'text-amber-600'} animate-spin`} />
                <span>
                  {useOpenRouter
                    ? 'Consultando OpenRouter (openrouter/free) y generando reactivos...'
                    : enableWebSearch
                    ? 'Consultando fuentes y diseñando reactivos con Gemini...'
                    : 'Procesando documentos y estructurando actividades...'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="px-5 py-2 bg-stone-100 border-t border-stone-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Target className="w-3.5 h-3.5 text-amber-600" />
          Sugerencias:
        </span>
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isLoading}
            onClick={() => handleSendMessage(qp.prompt)}
            className="whitespace-nowrap px-3 py-1 rounded text-xs font-medium bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-950 border border-stone-200 transition-colors shadow-2xs"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="px-5 py-2 bg-amber-50/50 border-t border-amber-200/50 flex flex-wrap gap-2">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs shadow-2xs"
            >
              {att.type === 'pdf' ? (
                <FileText className="w-4 h-4 text-red-500" />
              ) : (
                <FileCode className="w-4 h-4 text-blue-500" />
              )}
              <span className="font-semibold text-stone-800 max-w-[200px] truncate">{att.name}</span>
              <span className="text-[10px] text-stone-400">
                ({(att.size / 1024).toFixed(0)} KB)
              </span>
              <button
                type="button"
                onClick={() => removeAttachment(att.id)}
                className="text-stone-400 hover:text-red-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input box */}
      <div className="p-4 bg-white border-t border-stone-200">
        <div className="flex items-center justify-between px-1 mb-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-700 font-medium">
              Proveedor: <strong>{useOpenRouter ? 'OpenRouter' : 'Google Gemini'}</strong>
              <span className="font-mono text-xs text-stone-500 ml-1">({useOpenRouter ? 'openrouter/free' : selectedModel})</span>
            </span>
            <span className="text-stone-300">·</span>
            <button
              type="button"
              onClick={handleToggleOpenRouter}
              className="text-xs text-amber-700 hover:text-amber-800 underline transition-colors cursor-pointer"
            >
              {useOpenRouter ? 'Cambiar a Gemini' : 'Cambiar a OpenRouter Free'}
            </button>
          </div>
          <span className="text-[11px] text-stone-400 hidden sm:inline">Shift + Enter para nueva línea</span>
        </div>

        <div className="flex items-end gap-2 bg-stone-50 border border-stone-300 rounded-xl p-2 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all shadow-xs">
          {/* File upload hidden input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept=".pdf,.md,.txt,.json,.csv"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-stone-500 hover:text-amber-700 hover:bg-stone-200/60 rounded-lg transition-colors shrink-0"
            title="Adjuntar documento (PDF, Markdown .md, TXT, CSV, JSON)"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Escribe tu instrucción o pregunta sobre el temario (ej: 'Extrae los átomos del documento y crea 2 preguntas de test')..."
            rows={2}
            className="flex-1 bg-transparent border-0 resize-none text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-0 px-1 py-1"
          />

          <button
            type="button"
            disabled={isLoading || (!inputText.trim() && attachments.length === 0)}
            onClick={() => handleSendMessage()}
            className={`p-2 rounded-lg transition-all shrink-0 ${
              !inputText.trim() && attachments.length === 0
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
            }`}
            title="Enviar mensaje"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2 px-1">
          <div className="flex items-center gap-2">
            <span>Presiona <strong>Enter</strong> para enviar, <strong>Shift + Enter</strong> para salto de línea</span>
          </div>
          <div className="flex items-center gap-1 font-mono">
            <span>Model: {selectedModel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
