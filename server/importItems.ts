import express from 'express';
import { z } from 'zod';
import { itemInput, itemImportInput } from '../src/schemas/index.ts';

/**
 * Validates req.body against a Zod schema. On failure responds 400 with an
 * issue list and returns undefined; on success returns the parsed data
 * (unknown keys preserved via .passthrough()).
 */
export function validateBody<S extends z.ZodTypeAny>(
  schema: S,
  body: unknown,
  res: express.Response
): z.infer<S> | undefined {
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

/**
 * Parses items CSV (export-compatible headers) into raw item objects.
 * Handles quoted fields with doubled-quote escaping.
 * Expected headers: ID,Tipo,Pregunta/Enunciado,Respuesta Correcta,Base Legal,Regla Correctiva,Dificultad,Estado
 */
export function parseItemsCsv(csvText: string): any[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headerLine = lines[0];
  const headers = parseCsvLine(headerLine).map((h) => h.trim());

  const col = (name: string) => headers.indexOf(name);
  const idxId = col('ID');
  const idxType = col('Tipo');
  const idxStem = col('Pregunta/Enunciado');
  const idxAnswer = col('Respuesta Correcta');
  const idxLegal = col('Base Legal');
  const idxRule = col('Regla Correctiva');
  const idxDiff = col('Dificultad');
  const idxStatus = col('Estado');

  const items: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    if (!values.some((v) => v.trim().length > 0)) continue;

    const itemType = values[idxType] || 'cover_and_generate_mcq';
    const stem = values[idxStem] || '';
    if (!stem) continue;

    const item: any = {
      item_type: itemType,
      stem,
    };
    if (values[idxId]) item.id = values[idxId];
    if (values[idxAnswer]) item.correct_answer = values[idxAnswer];
    if (values[idxLegal]) item.legal_basis = values[idxLegal];
    if (values[idxRule]) item.corrective_rule = values[idxRule];
    if (values[idxDiff]) {
      const d = Number(values[idxDiff]);
      if (!Number.isNaN(d)) item.difficulty = Math.min(5, Math.max(1, Math.round(d)));
    }
    if (values[idxStatus]) item.status = values[idxStatus];
    items.push(item);
  }
  return items;
}

/** Splits a single CSV line into fields, honoring double-quoted fields with escaped quotes. */
export function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else { inQuotes = false; }
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { fields.push(cur); cur = ''; }
      else { cur += ch; }
    }
  }
  fields.push(cur);
  return fields;
}

/**
 * Express handler factory for POST /api/import/items.
 * Validates JSON items or CSV text, skips duplicates, imports valid items,
 * and returns a summary (imported / duplicates / errors).
 *
 * dbInstance is injected (rather than importing `db` directly) so the handler
 * can be unit-tested without starting the HTTP server.
 */
export function makeImportItemsHandler(dbInstance: typeof import('../server/db.ts').db) {
  return (req: express.Request, res: express.Response) => {
    const body = validateBody(itemImportInput, req.body, res);
    if (body === undefined) return;

    const defaultTopic = body.topic_id;
    const skipDuplicates = body.skip_duplicates !== false;

    // Collect candidate items: JSON array or CSV text
    let rawItems: any[] = [];
    if (Array.isArray(body.items)) {
      rawItems = body.items;
    } else if (typeof body.csvText === 'string' && body.csvText.trim()) {
      rawItems = parseItemsCsv(body.csvText);
    }

    const imported: any[] = [];
    const duplicates: any[] = [];
    const errors: Array<{ index: number; item: any; reason: string }> = [];

    const existingIds = new Set(dbInstance.getItems().map((i) => i.id));
    const existingStems = new Map(
      dbInstance.getItems().map((i) => [`${i.topic_id}||${(i.stem || '').trim()}`, i])
    );

    for (let idx = 0; idx < rawItems.length; idx++) {
      const raw = rawItems[idx];
      // Apply default topic if missing
      if (defaultTopic && !raw.topic_id) raw.topic_id = defaultTopic;

      // Validate against itemInput schema (per-item, so one bad item won't reject the whole batch)
      const parsed = itemInput.safeParse(raw);
      if (!parsed.success) {
        errors.push({
          index: idx,
          item: raw,
          reason: parsed.error.issues.map((i) => i.path.join('.') + ': ' + i.message).join('; '),
        });
        continue;
      }

      const item = parsed.data;
      const itemId = item.id;
      const stemKey = `${item.topic_id}||${(item.stem || '').trim()}`;

      let isDuplicate = false;
      if (itemId && existingIds.has(itemId)) isDuplicate = true;
      if (!isDuplicate && existingStems.has(stemKey)) isDuplicate = true;

      if (isDuplicate) {
        if (skipDuplicates) {
          duplicates.push({ index: idx, item, reason: 'Ítem duplicado (id o stem + tema ya existen)' });
          continue;
        }
      }

      try {
        const created = dbInstance.createItem(item as any);
        imported.push(created);
        existingIds.add(created.id);
        existingStems.set(`${created.topic_id}||${(created.stem || '').trim()}`, created);
      } catch (err: any) {
        errors.push({ index: idx, item, reason: err.message || 'Error al crear ítem' });
      }
    }

    res.json({
      imported: imported.length,
      duplicates: duplicates.length,
      errors: errors.length,
      importedItems: imported.map((i) => ({ id: i.id, stem: i.stem, item_type: i.item_type })),
      duplicatesDetail: duplicates,
      errorsDetail: errors,
    });
  };
}
