import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { isolateDataDir } from './helpers/isolation.ts';
import { ContentSetSaveError, db } from '../server/db.ts';
import type { ContentSetSaveInput } from '../src/types.ts';

const isolatedDir = isolateDataDir();

function makePayload(operationId: string): ContentSetSaveInput {
  return {
    operation_id: operationId,
    topic: {
      kind: 'new',
      name: `Set transaccional ${operationId}`,
      description: 'Prueba aislada de guardado atómico.',
    },
    clusters: [{
      temp_id: 'cluster-temp-1',
      name: 'Reglas de prueba',
      description: 'Clúster creado con el set.',
      type: 'conceptual',
      priority: 'high',
    }],
    atoms: [{
      text: 'La respuesta se guarda junto con su referencia.',
      atom_type: 'condition',
      legal_basis: 'Art. 1 de prueba',
      temp_cluster_id: 'cluster-temp-1',
      difficulty: 2,
      tags: ['set-test'],
    }],
    confusionPairs: [{
      concept_a: 'Regla A',
      concept_b: 'Regla B',
      discriminating_cue: 'La condición del supuesto.',
      common_trap: 'Intercambiar las condiciones.',
      legal_basis_a: 'Art. 1',
      legal_basis_b: 'Art. 2',
      severity: 'high',
    }],
  };
}

function getConnection() {
  return (db as unknown as {
    conn: {
      exec(sql: string): void;
      prepare(sql: string): { get(...values: string[]): { count: number } };
    };
  }).conn;
}

describe('Atomic Content Studio set save', () => {
  before(() => {
    assert.equal(process.env.OPOSILAB_DATA_DIR, isolatedDir);
    assert.equal(process.env.OPOSILAB_OFFLINE, '1');
    db.init();
  });

  test('stores topic and selected records together and safely replays a lost response', () => {
    const payload = makePayload('11111111-1111-4111-8111-111111111111');
    const result = db.createContentSet(payload);

    assert.equal(result.topic.name, payload.topic.kind === 'new' ? payload.topic.name : '');
    assert.equal(result.clusters.length, 1);
    assert.equal(result.atoms.length, 1);
    assert.equal(result.confusionPairs.length, 1);
    assert.equal(result.atoms[0].cluster_id, result.clusters[0].id);
    assert.equal(result.atoms[0].status, 'validated');
    assert.equal(result.confusionPairs[0].status, 'validated');

    const replay = db.createContentSet(payload);
    assert.deepEqual(replay, result);
    assert.equal(db.getTopics().filter((topic) => topic.id === result.topic.id).length, 1);
    assert.equal(db.getClusters(result.topic.id).filter((cluster) => cluster.id === result.clusters[0].id).length, 1);
    assert.equal(db.getAtoms({ topic_id: result.topic.id }).filter((atom) => atom.id === result.atoms[0].id).length, 1);
    assert.equal(db.getConfusionPairs(result.topic.id).filter((pair) => pair.id === result.confusionPairs[0].id).length, 1);

    const changed = makePayload(payload.operation_id);
    changed.topic = { kind: 'new', name: 'Otro set', description: 'Payload distinto.' };
    assert.throws(
      () => db.createContentSet(changed),
      (error: unknown) => error instanceof ContentSetSaveError && error.statusCode === 409,
    );
  });

  test('rolls back all in-memory and SQLite changes when the operation record cannot commit', () => {
    const payload = makePayload('22222222-2222-4222-8222-222222222222');
    const topicName = payload.topic.kind === 'new' ? payload.topic.name : '';
    const conn = getConnection();
    assert.ok(conn);
    const before = {
      topics: db.getTopics().length,
      clusters: db.getClusters().length,
      atoms: db.getAtoms().length,
      pairs: db.getConfusionPairs().length,
    };
    conn.exec(`
      CREATE TRIGGER fail_content_set_operation
      BEFORE INSERT ON content_set_operations
      WHEN NEW.operation_id = '${payload.operation_id}'
      BEGIN SELECT RAISE(ABORT, 'forced set persistence failure'); END;
    `);

    try {
      assert.throws(() => db.createContentSet(payload), /forced set persistence failure/);
      assert.deepEqual({
        topics: db.getTopics().length,
        clusters: db.getClusters().length,
        atoms: db.getAtoms().length,
        pairs: db.getConfusionPairs().length,
      }, before);
      assert.equal(
        conn.prepare('SELECT COUNT(*) AS count FROM content_set_operations WHERE operation_id = ?')
          .get(payload.operation_id)?.count,
        0,
      );
      assert.equal(
        conn.prepare('SELECT COUNT(*) AS count FROM topics WHERE id = ?')
          .get(`topic-set-${payload.operation_id}`)?.count,
        0,
      );
      assert.equal(
        conn.prepare('SELECT COUNT(*) AS count FROM clusters WHERE id LIKE ?')
          .get(`cluster-set-${payload.operation_id}-%`)?.count,
        0,
      );
      assert.equal(db.getTopics().some((topic) => topic.name === topicName), false);
    } finally {
      conn.exec('DROP TRIGGER fail_content_set_operation');
    }

    const saved = db.createContentSet(payload);
    assert.equal(saved.topic.name, topicName);
    assert.equal(db.createContentSet(payload).topic.id, saved.topic.id);
    assert.equal(db.getTopics().filter((topic) => topic.id === saved.topic.id).length, 1);
  });
});
