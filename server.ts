import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';
import { SchedulingEngine, InterleavingEngine } from './server/scheduler.ts';
import { DataExporter } from './server/exporter.ts';
import { AiAssistant } from './server/ai.ts';
import { JevClient } from './server/jev.ts';
import { QualityWarning, Item } from './src/types.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

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
    const updated = db.updateSettings(req.body);
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
    const topic = db.createTopic(req.body);
    res.status(201).json(topic);
  });

  app.put('/api/topics/:id', (req, res) => {
    const updated = db.updateTopic(req.params.id, req.body);
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
    const chunk = db.createSourceChunk(req.body);
    res.status(201).json(chunk);
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
    const atom = db.createAtom(req.body);
    res.status(201).json(atom);
  });

  app.put('/api/atoms/:id', (req, res) => {
    const updated = db.updateAtom(req.params.id, req.body);
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
    const cluster = db.createCluster(req.body);
    res.status(201).json(cluster);
  });

  // Confusion Pairs
  app.get('/api/confusion-pairs', (req, res) => {
    const topicId = req.query.topic_id as string | undefined;
    res.json(db.getConfusionPairs(topicId));
  });

  app.post('/api/confusion-pairs', (req, res) => {
    const pair = db.createConfusionPair(req.body);
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
    const items = db.getItems();
    const warnings: QualityWarning[] = [];

    for (const item of items) {
      if (!item.legal_basis || item.legal_basis.trim() === '') {
        warnings.push({
          item_id: item.id,
          severity: 'critical',
          rule: 'missing_legal_basis',
          message: `El ítem "${item.stem.slice(0, 40)}..." carece de cita de base legal explícita.`,
        });
      }

      if (item.item_type === 'cover_and_generate_mcq') {
        const opts = item.options || [];
        if (opts.length < 3) {
          warnings.push({
            item_id: item.id,
            severity: 'critical',
            rule: 'insufficient_options',
            message: `El ítem tiene menos de 3 opciones de respuesta (${opts.length}).`,
          });
        }
        for (const opt of opts) {
          if (!opt.is_correct) {
            if (!opt.explanation || opt.explanation.trim() === '') {
              warnings.push({
                item_id: item.id,
                severity: 'warning',
                rule: 'missing_distractor_explanation',
                message: `El distractor "${opt.id}" no tiene explicación de falsedad.`,
              });
            }
            if (!opt.trap_type) {
              warnings.push({
                item_id: item.id,
                severity: 'warning',
                rule: 'missing_trap_type',
                message: `El distractor "${opt.id}" no tiene asignada tipología de trampa.`,
              });
            }
          }
        }
      }
    }

    res.json(warnings);
  });

  app.get('/api/items/:id', (req, res) => {
    const item = db.getItem(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  });

  app.post('/api/items', (req, res) => {
    const item = db.createItem(req.body);
    res.status(201).json(item);
  });

  app.put('/api/items/:id', (req, res) => {
    const updated = db.updateItem(req.params.id, req.body);
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
    const items = InterleavingEngine.generateBlock(req.body);
    res.json(items);
  });

  // Attempt recording (SRS Engine)
  app.post('/api/attempts', (req, res) => {
    const result = db.recordAttempt(req.body);
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
    const updated = db.updateErrorLog(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Error log not found' });
    res.json(updated);
  });

  // Sessions
  app.get('/api/sessions', (req, res) => {
    res.json(db.getSessions());
  });

  app.post('/api/sessions', (req, res) => {
    const session = db.createSession(req.body);
    res.status(201).json(session);
  });

  app.get('/api/sessions/saved-state', (req, res) => {
    res.json(db.getSavedSessionState());
  });

  app.post('/api/sessions/save-state', (req, res) => {
    db.setSavedSessionState(req.body);
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
    try {
      const { text, articleRef } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text required' });
      }
      const setResult = await AiAssistant.extractFullSet(text, articleRef);
      res.json(setResult);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'AI set extraction failed' });
    }
  });

  app.post('/api/ai/extract-atoms', async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text required' });
      }
      const atoms = await AiAssistant.extractAtoms(text);
      res.json(atoms);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'AI extraction failed' });
    }
  });

  app.post('/api/ai/draft-item', async (req, res) => {
    try {
      const { atom, itemType } = req.body;
      if (!atom || !itemType) {
        return res.status(400).json({ error: 'Atom and itemType required' });
      }
      const drafted = await AiAssistant.draftItem(atom, itemType);
      res.json(drafted);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'AI drafting failed' });
    }
  });

  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { messages, model, provider, enableWebSearch, systemInstruction, topicContext } = req.body;
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Array of messages required' });
      }
      const reply = await AiAssistant.chat({
        messages,
        model,
        provider,
        enableWebSearch,
        systemInstruction,
        topicContext,
      });
      res.json(reply);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'AI Chat failed' });
    }
  });

  // Jev (TypeSafe Decision Model on OpenRouter) Endpoints
  app.post('/api/jev/decisions', async (req, res) => {
    try {
      const { state, questions, model } = req.body;
      if (!state || !questions) {
        return res.status(400).json({ error: 'state and questions are required' });
      }
      const decisions = await JevClient.makeDecisions({ state, questions, model });
      res.json(decisions);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Jev decision call failed' });
    }
  });

  app.post('/api/jev/audit-item', async (req, res) => {
    try {
      const { item, sourceNorm } = req.body;
      if (!item) {
        return res.status(400).json({ error: 'Item object required' });
      }
      const audit = await JevClient.auditItemQuality(item, sourceNorm);
      res.json(audit);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Jev item audit failed' });
    }
  });

  app.post('/api/jev/diagnose-attempt', async (req, res) => {
    try {
      const attemptData = req.body;
      const diagnosis = await JevClient.diagnoseAttempt(attemptData);
      res.json(diagnosis);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Jev attempt diagnosis failed' });
    }
  });

  app.post('/api/jev/classify-atom', async (req, res) => {
    try {
      const atomData = req.body;
      const classification = await JevClient.classifyAtom(atomData);
      res.json(classification);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Jev atom classification failed' });
    }
  });

  app.post('/api/jev/verify-cascade', async (req, res) => {
    try {
      const { draftItem, sourceText } = req.body;
      if (!draftItem || !sourceText) {
        return res.status(400).json({ error: 'draftItem and sourceText required' });
      }
      const verification = await JevClient.verifyCascade(draftItem, sourceText);
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
    try {
      const success = db.restoreData(req.body);
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
