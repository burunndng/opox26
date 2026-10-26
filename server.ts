import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { z } from 'zod';
import { db } from './server/db.ts';
import { SchedulingEngine, InterleavingEngine } from './server/scheduler.ts';
import { DataExporter } from './server/exporter.ts';
import { AiAssistant } from './server/ai.ts';
import { JevClient } from './server/jev.ts';
import { Item, AppSettings, QualityWarning } from './src/types.ts';
import {
  topicInput,
  sourceChunkInput,
  atomInput,
  clusterInput,
  confusionPairInput,
  itemInput,
  attemptInput,
  errorLogUpdateInput,
  settingsUpdateInput,
  sessionInput,
  pdfImportInput,
  suggestAtomsInput,
  chunkSplitInput,
  interleavedBlockInput,
  savedSessionStateInput,
  aiExtractSetInput,
  aiExtractAtomsInput,
  aiDraftItemInput,
  aiChatInput,
  jevDecisionsInput,
  jevAuditItemInput,
  jevDiagnoseAttemptInput,
  jevClassifyAtomInput,
  jevVerifyCascadeInput,
  jevCompareInput,
  backupInput,
} from './src/schemas/index.ts';
import { parsePdf, PdfImportError } from './server/pdfImport.ts';
import { suggestAtoms, splitIntoChunks } from './server/heuristics.ts';
import { buildValidationWarnings, getCriticalItemErrors, promotionGatePayload } from './server/validationWarnings.ts';

/**
 * Validates req.body against a Zod schema. On failure responds 400 with an
 * issue list and returns undefined; on success returns the parsed data
 * (unknown keys preserved via .passthrough()).
 */
function validateBody<S extends z.ZodTypeAny>(schema: S, body: unknown, res: express.Response): z.infer<S> | undefined {
  const result = schema.safeParse(body);
  if (!result.success) {
    res.status(400).json({
      error: 'Validación fallida',
      issues: result.error.issues.map((i) => ({
        path: i.path.join('.'),
        code: i.code,
        message: i.message,
      })),
    });
    return undefined;
  }
  return result.data;
}

/** Aggregates atom suggestions by inferred type for quick UI stats. */
function countByType(suggestions: Array<{ atom_type: string }>): Record<string, number> {
  return suggestions.reduce<Record<string, number>>((acc, s) => {
    acc[s.atom_type] = (acc[s.atom_type] ?? 0) + 1;
    return acc;
  }, {});
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'OposiLab MCQ Trainer', time: new Date().toISOString() });
  });

  // Settings
  app.get('/api/settings', (req, res) => {
    res.json(db.getSettings());
  });

  app.put('/api/settings', (req, res) => {
    const body = validateBody(settingsUpdateInput, req.body, res);
    if (body === undefined) return;
    const updated = db.updateSettings(body as Partial<AppSettings>);
    res.json(updated);
  });

  // Topics
  app.get('/api/topics', (req, res) => {
    res.json(db.getTopics());
  });

  app.get('/api/topics/:id', (req, res) => {
    const topic = db.getTopic(req.params.id);
    if (!topic) return res.status(404).json({ error: 'Topic not found' });
    res.json(topic);
  });

  app.post('/api/topics', (req, res) => {
    const body = validateBody(topicInput, req.body, res);
    if (body === undefined) return;
    const topic = db.createTopic(body);
    res.status(201).json(topic);
  });

  app.put('/api/topics/:id', (req, res) => {
    const body = validateBody(topicInput.partial(), req.body, res);
    if (body === undefined) return;
    const updated = db.updateTopic(req.params.id, body);
    if (!updated) return res.status(404).json({ error: 'Topic not found' });
    res.json(updated);
  });

  app.delete('/api/topics/:id', (req, res) => {
    const deleted = db.deleteTopic(req.params.id);
    res.json({ success: deleted });
  });

  // Source Chunks
  app.get('/api/source-chunks', (req, res) => {
    const topicId = req.query.topic_id as string | undefined;
    res.json(db.getSourceChunks(topicId));
  });

  app.post('/api/source-chunks', (req, res) => {
    const body = validateBody(sourceChunkInput, req.body, res);
    if (body === undefined) return;
    const chunk = db.createSourceChunk(body as any);
    res.status(201).json(chunk);
  });

  // --- Local-first import pipeline (offline, no AI) ---
  app.post('/api/import/pdf', async (req, res) => {
    const body = validateBody(pdfImportInput, req.body, res);
    if (body === undefined) return;
    try {
      const buffer = Buffer.from(body.data_base64, 'base64');
      const result = await parsePdf(buffer);
      res.json({ filename: body.filename, ...result });
    } catch (err: any) {
      if (err instanceof PdfImportError) {
        res.status(422).json({ error: err.message, fallback: 'paste' });
      } else {
        res.status(500).json({ error: err?.message || 'Error inesperado al procesar el PDF' });
      }
    }
  });

  app.post('/api/import/suggest-atoms', (req, res) => {
    const body = validateBody(suggestAtomsInput, req.body, res);
    if (body === undefined) return;
    const suggestions = suggestAtoms(body.text, body.max_suggestions);
    res.json({
      suggestions,
      stats: { total_sentences: suggestions.length, by_type: countByType(suggestions) },
    });
  });

  app.post('/api/import/chunk', (req, res) => {
    const body = validateBody(chunkSplitInput, req.body, res);
    if (body === undefined) return;
    const drafts = splitIntoChunks(body.pages ?? body.text!);
    res.json({ chunks: drafts });
  });

  // Atoms
  app.get('/api/atoms', (req, res) => {
    const filter = {
      topic_id: req.query.topic_id as string | undefined,
      cluster_id: req.query.cluster_id as string | undefined,
      status: req.query.status as string | undefined,
    };
    res.json(db.getAtoms(filter));
  });

  app.post('/api/atoms', (req, res) => {
    const body = validateBody(atomInput, req.body, res);
    if (body === undefined) return;
    const atom = db.createAtom(body as any);
    res.status(201).json(atom);
  });

  app.put('/api/atoms/:id', (req, res) => {
    const body = validateBody(atomInput.partial(), req.body, res);
    if (body === undefined) return;
    const updated = db.updateAtom(req.params.id, body as any);
    if (!updated) return res.status(404).json({ error: 'Atom not found' });
    res.json(updated);
  });

  app.delete('/api/atoms/:id', (req, res) => {
    const deleted = db.deleteAtom(req.params.id);
    res.json({ success: deleted });
  });

  // Clusters
  app.get('/api/clusters', (req, res) => {
    const topicId = req.query.topic_id as string | undefined;
    res.json(db.getClusters(topicId));
  });

  app.post('/api/clusters', (req, res) => {
    const body = validateBody(clusterInput, req.body, res);
    if (body === undefined) return;
    const cluster = db.createCluster(body as any);
    res.status(201).json(cluster);
  });

  // Confusion Pairs
  app.get('/api/confusion-pairs', (req, res) => {
    const topicId = req.query.topic_id as string | undefined;
    res.json(db.getConfusionPairs(topicId));
  });

  app.post('/api/confusion-pairs', (req, res) => {
    const body = validateBody(confusionPairInput, req.body, res);
    if (body === undefined) return;
    const pair = db.createConfusionPair(body as any);
    res.status(201).json(pair);
  });

  // Items
  app.get('/api/items', (req, res) => {
    const filter = {
      topic_id: req.query.topic_id as string | undefined,
      cluster_id: req.query.cluster_id as string | undefined,
      item_type: req.query.item_type as string | undefined,
      status: req.query.status as string | undefined,
      confusion_pair_id: req.query.confusion_pair_id as string | undefined,
    };
    res.json(db.getItems(filter));
  });

  app.get('/api/items/validation-warnings', (req, res) => {
    res.json(buildValidationWarnings(db.getItems()));
  });

  app.get('/api/items/:id', (req, res) => {
    const item = db.getItem(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  });

  app.post('/api/items', (req, res) => {
    const body = validateBody(itemInput, req.body, res);
    if (body === undefined) return;
    const gate = promotionGatePayload(body as Partial<Item>);
    if (gate) return res.status(422).json(gate);
    const item = db.createItem(body as any);
    res.status(201).json(item);
  });

  app.put('/api/items/:id', (req, res) => {
    const body = validateBody(itemInput.partial(), req.body, res);
    if (body === undefined) return;
    // When the patch carries a status, gate the MERGED item (stored state +
    // patch) so partial updates cannot smuggle a promotion past a critical
    // failure. Unknown ids keep falling through to the 404 in updateItem.
    const gateTarget = body.status ? db.getItem(req.params.id) : undefined;
    if (gateTarget) {
      const gate = promotionGatePayload({ ...gateTarget, ...body } as Partial<Item>);
      if (gate) return res.status(422).json(gate);
    }
    const updated = db.updateItem(req.params.id, body as any);
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  });

  app.delete('/api/items/:id', (req, res) => {
    const deleted = db.deleteItem(req.params.id);
    res.json({ success: deleted });
  });

  // Review Schedule & Queue
  app.get('/api/schedule/stats', (req, res) => {
    const topicId = req.query.topic_id as string | undefined;
    res.json(SchedulingEngine.getDueStats(topicId));
  });

  app.get('/api/schedule/due-queue', (req, res) => {
    const limit = parseInt(req.query.limit as string) || 20;
    const topicId = req.query.topic_id as string | undefined;
    res.json(SchedulingEngine.getDueQueue(limit, topicId));
  });

  app.post('/api/schedule/interleaved-block', (req, res) => {
    const body = validateBody(interleavedBlockInput, req.body, res);
    if (body === undefined) return;
    const items = InterleavingEngine.generateBlock(body as any);
    res.json(items);
  });

  // Attempt recording (SRS Engine)
  app.post('/api/attempts', (req, res) => {
    const body = validateBody(attemptInput, req.body, res);
    if (body === undefined) return;
    const result = db.recordAttempt(body as any);
    res.status(201).json(result);
  });

  app.get('/api/attempts', (req, res) => {
    res.json(db.getAttempts());
  });

  // Error Logs
  app.get('/api/errors', (req, res) => {
    const status = req.query.status as string | undefined;
    res.json(db.getErrorLogs(status ? { status } : undefined));
  });

  app.put('/api/errors/:id', (req, res) => {
    const body = validateBody(errorLogUpdateInput, req.body, res);
    if (body === undefined) return;
    const updated = db.updateErrorLog(req.params.id, body as any);
    if (!updated) return res.status(404).json({ error: 'Error log not found' });
    res.json(updated);
  });

  // Sessions
  app.get('/api/sessions', (req, res) => {
    res.json(db.getSessions());
  });

  app.post('/api/sessions', (req, res) => {
    const body = validateBody(sessionInput, req.body, res);
    if (body === undefined) return;
    const session = db.createSession(body as any);
    res.status(201).json(session);
  });

  app.get('/api/sessions/saved-state', (req, res) => {
    res.json(db.getSavedSessionState());
  });

  app.post('/api/sessions/save-state', (req, res) => {
    const body = validateBody(savedSessionStateInput, req.body, res);
    if (body === undefined) return;
    db.setSavedSessionState(body);
    res.json({ success: true });
  });

  app.delete('/api/sessions/saved-state', (req, res) => {
    db.clearSavedSessionState();
    res.json({ success: true });
  });

  app.get('/api/sessions/:id/export', (req, res) => {
    const session = db.getSessions().find((s) => s.id === req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    const attempts = db.getAttempts().filter((a) => a.session_id === session.id);
    res.json({ session, attempts });
  });

  // AI Assistant Endpoints
  app.post('/api/ai/extract-set', async (req, res) => {
    const body = validateBody(aiExtractSetInput, req.body, res);
    if (body === undefined) return;
    try {
      const setResult = await AiAssistant.extractFullSet(body.text, body.articleRef);
      res.json(setResult);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'AI set extraction failed' });
    }
  });

  app.post('/api/ai/extract-atoms', async (req, res) => {
    const body = validateBody(aiExtractAtomsInput, req.body, res);
    if (body === undefined) return;
    try {
      const atoms = await AiAssistant.extractAtoms(body.text);
      res.json(atoms);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'AI extraction failed' });
    }
  });

  app.post('/api/ai/draft-item', async (req, res) => {
    const body = validateBody(aiDraftItemInput, req.body, res);
    if (body === undefined) return;
    try {
      const drafted = await AiAssistant.draftItem(body.atom as any, body.itemType as any);
      res.json(drafted);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'AI drafting failed' });
    }
  });

  app.post('/api/ai/chat', async (req, res) => {
    const body = validateBody(aiChatInput, req.body, res);
    if (body === undefined) return;
    try {
      const reply = await AiAssistant.chat({
        messages: body.messages as any,
        model: body.model,
        provider: body.provider,
        enableWebSearch: body.enableWebSearch,
        systemInstruction: body.systemInstruction,
        topicContext: body.topicContext,
      });
      res.json(reply);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'AI Chat failed' });
    }
  });

  // Jev (TypeSafe Decision Model on OpenRouter) Endpoints
  app.post('/api/jev/decisions', async (req, res) => {
    const body = validateBody(jevDecisionsInput, req.body, res);
    if (body === undefined) return;
    try {
      const decisions = await JevClient.makeDecisions(body as any);
      res.json(decisions);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Jev decision call failed' });
    }
  });

  app.post('/api/jev/audit-item', async (req, res) => {
    const body = validateBody(jevAuditItemInput, req.body, res);
    if (body === undefined) return;
    try {
      const audit = await JevClient.auditItemQuality(body.item, body.sourceNorm);
      res.json(audit);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Jev item audit failed' });
    }
  });

  app.post('/api/jev/diagnose-attempt', async (req, res) => {
    const body = validateBody(jevDiagnoseAttemptInput, req.body, res);
    if (body === undefined) return;
    try {
      const attemptData = body;
      const diagnosis = await JevClient.diagnoseAttempt(attemptData as any);
      res.json(diagnosis);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Jev attempt diagnosis failed' });
    }
  });

  app.post('/api/jev/classify-atom', async (req, res) => {
    const body = validateBody(jevClassifyAtomInput, req.body, res);
    if (body === undefined) return;
    try {
      const atomData = body;
      const classification = await JevClient.classifyAtom(atomData as any);
      res.json(classification);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Jev atom classification failed' });
    }
  });

  app.post('/api/jev/verify-cascade', async (req, res) => {
    const body = validateBody(jevVerifyCascadeInput, req.body, res);
    if (body === undefined) return;
    try {
      const verification = await JevClient.verifyCascade(body.draftItem, body.sourceText);
      res.json(verification);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Jev cascade verification failed' });
    }
  });

  
  // Export / Import
  app.get('/api/export/backup', (req, res) => {
    res.setHeader('Content-Disposition', 'attachment; filename="oposilab-backup.json"');
    res.setHeader('Content-Type', 'application/json');
    res.send(DataExporter.exportFullJson());
  });

  app.post('/api/import/backup', (req, res) => {
    const body = validateBody(backupInput, req.body, res);
    if (body === undefined) return;
    try {
      const success = db.restoreData(body as any);
      res.json({ success });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Invalid backup' });
    }
  });

  app.get('/api/export/anki', (req, res) => {
    const topicId = req.query.topic_id as string | undefined;
    res.json(DataExporter.exportAnkiTsv(topicId));
  });

  app.get('/api/export/csv-items', (req, res) => {
    const topicId = req.query.topic_id as string | undefined;
    res.setHeader('Content-Disposition', 'attachment; filename="oposilab-items.csv"');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.send(DataExporter.exportItemsCsv(topicId));
  });

  app.get('/api/export/csv-errors', (req, res) => {
    res.setHeader('Content-Disposition', 'attachment; filename="oposilab-errors.csv"');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.send(DataExporter.exportErrorsCsv());
  });

  app.get('/api/export/quizlet', (req, res) => {
    const topicId = req.query.topic_id as string | undefined;
    res.setHeader('Content-Disposition', 'attachment; filename="oposilab-quizlet.txt"');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(DataExporter.exportQuizletPlainText(topicId));
  });

  app.get('/api/export/analytics-md', (req, res) => {
    res.setHeader('Content-Disposition', 'attachment; filename="oposilab-report.md"');
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.send(DataExporter.exportAnalyticsMarkdown());
  });

  // Vite middleware in dev; static file serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OposiLab server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
