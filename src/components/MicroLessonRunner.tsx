import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, BrainCircuit, CheckCircle2, Eye, Lightbulb, PlusCircle, XCircle } from 'lucide-react';
import { Atom, Item, SourceChunk, Topic } from '../types.ts';
import { api } from '../api.ts';
import { matchAtomsToAnswer, AtomMatch } from '../utils/retrievalMatch.ts';

/**
 * Retrieval-first micro-lesson (spec §9.2): replaces passive reading with
 * read → attempt recall → reveal → keyword-match → convert misses into
 * retrieval_prompt items (which auto-enter the review queue).
 */
interface MicroLessonRunnerProps {
  topic: Topic;
  atoms: Atom[];
  onExit: () => void;
  onItemCreated?: () => void;
}

type Phase = 'reading' | 'retrieval' | 'feedback';

export const MicroLessonRunner: React.FC<MicroLessonRunnerProps> = ({ topic, atoms, onExit, onItemCreated }) => {
  const [chunks, setChunks] = useState<SourceChunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('reading');
  const [recallAnswer, setRecallAnswer] = useState('');
  const [matches, setMatches] = useState<AtomMatch[]>([]);
  const [createdCount, setCreatedCount] = useState(0);
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [totalRecalled, setTotalRecalled] = useState({ recalled: 0, total: 0 });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const loaded = await api.getSourceChunks(topic.id);
        if (!cancelled) setChunks(loaded.filter((c) => c.raw_text?.trim()));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [topic.id]);

  const currentChunk = chunks[chunkIndex];

  // Key atoms for the current chunk: linked by source_chunk_id, else topic-wide
  // atoms whose text overlaps the chunk (fallback for unlinked seeds).
  const keyAtoms = useMemo<Atom[]>(() => {
    if (!currentChunk) return [];
    const linked = atoms.filter((a) => a.source_chunk_id === currentChunk.id);
    if (linked.length > 0) return linked;
    const chunkNorm = currentChunk.raw_text.toLowerCase().slice(0, 400);
    return atoms.filter((a) => {
      if (a.topic_id !== topic.id) return false;
      const firstWords = (a.text ?? '').toLowerCase().slice(0, 40);
      return firstWords && chunkNorm.includes(firstWords.slice(0, 25));
    });
  }, [atoms, currentChunk, topic.id]);

  const handleReveal = () => {
    const result = matchAtomsToAnswer(recallAnswer, keyAtoms);
    setMatches(result);
    setTotalRecalled((prev) => ({
      recalled: prev.recalled + result.filter((r) => r.recalled).length,
      total: prev.total + result.length,
    }));
    setPhase('feedback');
  };

  const handleCreateRetrievalItem = async (match: AtomMatch) => {
    const atom = atoms.find((a) => a.id === match.atomId);
    if (!atom) return;
    setCreatingId(match.atomId);
    try {
      const draft: Partial<Item> = {
        topic_id: topic.id,
        cluster_id: atom.cluster_id,
        item_type: 'retrieval_prompt',
        stem: `Escribe de memoria: ${atom.text?.replace(/^(El|La|Los|Las)\s+/i, '')}`,
        prompt_before_options: 'Intenta escribir la regla completa antes de revelar.',
        correct_answer: atom.text,
        legal_basis: atom.legal_basis || 'TRLGSS',
        rule_statement: atom.text ?? '',
        why_correct: 'Regla literal del temario.',
        corrective_rule: atom.legal_basis ? `Repasa ${atom.legal_basis}.` : 'Repasa el fragmento de origen.',
        difficulty: atom.difficulty ?? 3,
        cognitive_operations: ['generative_retrieval'],
        status: 'draft',
        source: 'manual',
      };
      await api.createItem(draft);
      setCreatedCount((n) => n + 1);
      onItemCreated?.();
    } catch (err) {
      console.error('Failed to create retrieval item:', err);
    } finally {
      setCreatingId(null);
    }
  };

  const handleNextChunk = () => {
    if (chunkIndex + 1 >= chunks.length) {
      setFinished(true);
      return;
    }
    setChunkIndex((i) => i + 1);
    setRecallAnswer('');
    setMatches([]);
    setPhase('reading');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-slate-400 text-sm">
        Cargando fragmentos del tema…
      </div>
    );
  }

  if (chunks.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-4">
        <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
        <p className="text-slate-300 text-sm">
          Este tema aún no tiene fragmentos de origen. Importa el texto o PDF en el Content Studio
          ("Crear fragmentos") para habilitar las micro-lecciones.
        </p>
        <button onClick={onExit} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm">
          Volver
        </button>
      </div>
    );
  }

  if (finished) {
    const pct = totalRecalled.total > 0 ? Math.round((totalRecalled.recalled / totalRecalled.total) * 100) : 0;
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-5">
          <BrainCircuit className="w-12 h-12 text-indigo-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Estudio completado</h2>
          <p className="text-sm text-slate-300">
            {chunks.length} fragmentos leídos · recuperación:{' '}
            <span className="font-mono font-bold text-indigo-300">{totalRecalled.recalled}/{totalRecalled.total}</span>{' '}
            átomos ({pct}%) recordados de memoria antes de releer.
          </p>
          {createdCount > 0 && (
            <p className="text-xs text-emerald-300">
              ✓ {createdCount} ítems de recuperación creados como borrador — valídalos en el Item Bank para
              activarlos en la cola de repaso.
            </p>
          )}
          {pct < 50 && (
            <p className="text-xs text-amber-300">
              ⚠️ Recuperación baja: estos elementos entrarán en rotación cercana mediante los ítems creados.
            </p>
          )}
          <button onClick={onExit} className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm">
            Volver al Panel
          </button>
        </div>
      </div>
    );
  }

  const missed = matches.filter((m) => !m.recalled);

  return (
    <div className="max-w-3xl mx-auto pb-16 px-4">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b border-slate-800 mb-6">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Estudio guiado: {topic.name}</span>
          </span>
        </div>
        <button onClick={onExit} className="text-xs text-slate-400 hover:text-white transition">
          ✕ Salir
        </button>
      </div>

      {/* Progress */}
      <div className="w-full bg-slate-800 rounded-full h-1.5 mb-6">
        <div
          className="bg-indigo-500 h-1.5 rounded-full transition-all"
          style={{ width: `${((chunkIndex + (phase === 'feedback' ? 1 : 0)) / chunks.length) * 100}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-500 mb-4 font-mono">
        Fragmento {chunkIndex + 1} / {chunks.length}
        {currentChunk?.article_reference ? ` · ${currentChunk.article_reference}` : ''}
        {currentChunk?.page_number ? ` · pág. ${currentChunk.page_number}` : ''}
      </p>

      {phase === 'reading' && currentChunk && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {currentChunk.raw_text}
          </div>
          <button
            onClick={() => setPhase('retrieval')}
            className="w-full px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-sm transition flex items-center justify-center space-x-2"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>He terminado de leer — poner a prueba mi memoria</span>
          </button>
        </div>
      )}

      {phase === 'retrieval' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-sm text-indigo-200">
            <strong>Intenta recordar antes de continuar.</strong> Sin volver arriba: escribe la regla de memoria.
            ¿Qué plazos, importes u órganos aparecían? ¿Qué excepción puede confundirse?
          </div>
          <textarea
            rows={6}
            value={recallAnswer}
            onChange={(e) => setRecallAnswer(e.target.value)}
            autoFocus
            placeholder="Escribe aquí la regla, los datos numéricos y las excepciones que recuerdes…"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
          <button
            onClick={handleReveal}
            disabled={!recallAnswer.trim()}
            className="w-full px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm transition flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Mostrar regla correcta</span>
          </button>
        </div>
      )}

      {phase === 'feedback' && (
        <div className="space-y-4">
          {/* Recall scorecard */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-emerald-300 font-mono">{matches.length - missed.length}</div>
              <div className="text-[10px] text-emerald-400/80 uppercase">Recordados</div>
            </div>
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-center">
              <XCircle className="w-4 h-4 text-rose-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-rose-300 font-mono">{missed.length}</div>
              <div className="text-[10px] text-rose-400/80 uppercase">Fallados</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <Lightbulb className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-amber-300 font-mono">{createdCount}</div>
              <div className="text-[10px] text-slate-400 uppercase">Ítems creados</div>
            </div>
          </div>

          {/* Per-atom matches */}
          <div className="space-y-2">
            {matches.map((m) => (
              <div
                key={m.atomId}
                className={`p-3 rounded-xl border text-xs ${
                  m.recalled
                    ? 'bg-emerald-950/20 border-emerald-800/30'
                    : 'bg-rose-950/20 border-rose-800/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className={m.recalled ? 'text-emerald-200' : 'text-rose-200'}>{m.atomText}</p>
                    <p className="text-slate-500">
                      {m.recalled
                        ? `✓ Recordado (${m.matched.length}/${m.matched.length + m.missed.length} claves)`
                        : `✗ Claves no recordadas: ${m.missed.slice(0, 6).join(', ')}`}
                    </p>
                  </div>
                  {!m.recalled && (
                    <button
                      onClick={() => handleCreateRetrievalItem(m)}
                      disabled={creatingId === m.atomId}
                      className="shrink-0 px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 text-[11px] font-bold transition flex items-center space-x-1"
                      title="Crea un ítem de recuperación (borrador) que entra en la cola de repaso al validarlo"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{creatingId === m.atomId ? 'Creando…' : 'Crear ítem de repaso'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {matches.length === 0 && (
              <p className="text-xs text-slate-500">
                Este fragmento no tiene átomos vinculados — la recuperación se evaluará en fragmentos con átomos.
              </p>
            )}
          </div>

          <button
            onClick={handleNextChunk}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition flex items-center justify-center space-x-2"
          >
            <span>{chunkIndex + 1 >= chunks.length ? 'Finalizar micro-lección' : 'Siguiente fragmento'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
