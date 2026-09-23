import {
  Topic,
  SourceChunk,
  Atom,
  Cluster,
  ConfusionPair,
  Item,
  ActivityAttempt,
  ErrorLog,
  Session,
  AppSettings,
  QualityWarning,
  ChatMessage,
  GroundingCitation,
  JevDecisionResponse,
  JevQuestion,
  JevItemAuditResult,
  JevAttemptDiagnosisResult,
  JevAtomClassificationResult,
  JevCascadeVerificationResult,
} from './types.ts';

/**
 * Resilient HTTP fetcher with retry capability for startup race conditions
 */
async function request<T>(
  url: string,
  options?: RequestInit,
  retries = 2,
  delayMs = 400
): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        let errorMsg = `HTTP ${res.status}: ${res.statusText}`;
        try {
          const errJson = await res.json();
          if (errJson?.error) errorMsg = errJson.error;
        } catch {
          // Response body was not JSON
        }
        throw new Error(errorMsg);
      }
      return (await res.json()) as T;
    } catch (err: any) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

export const api = {
  // Health
  async getHealth() {
    return request<{ status: string; app: string; time: string }>('/api/health');
  },

  // Settings
  async getSettings(): Promise<AppSettings> {
    return request<AppSettings>('/api/settings');
  },

  async updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    return request<AppSettings>(
      '/api/settings',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      },
      0
    );
  },

  // Topics
  async getTopics(): Promise<Topic[]> {
    return request<Topic[]>('/api/topics');
  },

  async createTopic(topic: Partial<Topic>): Promise<Topic> {
    return request<Topic>(
      '/api/topics',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(topic),
      },
      0
    );
  },

  async updateTopic(id: string, updates: Partial<Topic>): Promise<Topic> {
    return request<Topic>(
      `/api/topics/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      },
      0
    );
  },

  async deleteTopic(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(
      `/api/topics/${id}`,
      {
        method: 'DELETE',
      },
      0
    );
  },

  // Source Chunks
  async getSourceChunks(topicId?: string): Promise<SourceChunk[]> {
    const url = topicId ? `/api/source-chunks?topic_id=${topicId}` : '/api/source-chunks';
    return request<SourceChunk[]>(url);
  },

  async createSourceChunk(chunk: Partial<SourceChunk>): Promise<SourceChunk> {
    return request<SourceChunk>(
      '/api/source-chunks',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chunk),
      },
      0
    );
  },

  // Atoms
  async getAtoms(filter?: { topic_id?: string; cluster_id?: string; status?: string }): Promise<Atom[]> {
    const params = new URLSearchParams();
    if (filter?.topic_id) params.set('topic_id', filter.topic_id);
    if (filter?.cluster_id) params.set('cluster_id', filter.cluster_id);
    if (filter?.status) params.set('status', filter.status);
    return request<Atom[]>(`/api/atoms?${params.toString()}`);
  },

  async createAtom(atom: Partial<Atom>): Promise<Atom> {
    return request<Atom>(
      '/api/atoms',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(atom),
      },
      0
    );
  },

  async updateAtom(id: string, atom: Partial<Atom>): Promise<Atom> {
    return request<Atom>(
      `/api/atoms/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(atom),
      },
      0
    );
  },

  async deleteAtom(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/atoms/${id}`, { method: 'DELETE' }, 0);
  },

  // Clusters
  async getClusters(topicId?: string): Promise<Cluster[]> {
    const url = topicId ? `/api/clusters?topic_id=${topicId}` : '/api/clusters';
    return request<Cluster[]>(url);
  },

  async createCluster(cluster: Partial<Cluster>): Promise<Cluster> {
    return request<Cluster>(
      '/api/clusters',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cluster),
      },
      0
    );
  },

  // Confusion Pairs
  async getConfusionPairs(topicId?: string): Promise<ConfusionPair[]> {
    const url = topicId ? `/api/confusion-pairs?topic_id=${topicId}` : '/api/confusion-pairs';
    return request<ConfusionPair[]>(url);
  },

  async createConfusionPair(pair: Partial<ConfusionPair>): Promise<ConfusionPair> {
    return request<ConfusionPair>(
      '/api/confusion-pairs',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pair),
      },
      0
    );
  },

  // Items
  async getItems(filter?: {
    topic_id?: string;
    cluster_id?: string;
    item_type?: string;
    status?: string;
    confusion_pair_id?: string;
  }): Promise<Item[]> {
    const params = new URLSearchParams();
    if (filter?.topic_id) params.set('topic_id', filter.topic_id);
    if (filter?.cluster_id) params.set('cluster_id', filter.cluster_id);
    if (filter?.item_type) params.set('item_type', filter.item_type);
    if (filter?.status) params.set('status', filter.status);
    if (filter?.confusion_pair_id) params.set('confusion_pair_id', filter.confusion_pair_id);
    return request<Item[]>(`/api/items?${params.toString()}`);
  },

  async getItem(id: string): Promise<Item> {
    return request<Item>(`/api/items/${id}`);
  },

  async createItem(item: Partial<Item>): Promise<Item> {
    return request<Item>(
      '/api/items',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      },
      0
    );
  },

  async updateItem(id: string, item: Partial<Item>): Promise<Item> {
    return request<Item>(
      `/api/items/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      },
      0
    );
  },

  async deleteItem(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/items/${id}`, { method: 'DELETE' }, 0);
  },

  async getValidationWarnings(): Promise<QualityWarning[]> {
    return request<QualityWarning[]>('/api/items/validation-warnings');
  },

  // SRS Schedule & Due Queue
  async getScheduleStats(topicId?: string) {
    const url = topicId ? `/api/schedule/stats?topic_id=${topicId}` : '/api/schedule/stats';
    return request<any>(url);
  },

  async getDueQueue(limit = 20, topicId?: string): Promise<Item[]> {
    const url = topicId
      ? `/api/schedule/due-queue?limit=${limit}&topic_id=${topicId}`
      : `/api/schedule/due-queue?limit=${limit}`;
    return request<Item[]>(url);
  },

  async generateInterleavedBlock(params: {
    blockSize: number;
    topicId?: string;
    includeNew?: boolean;
    includeMaintenance?: boolean;
    focusConfusionPairs?: boolean;
    activityTypes?: string[];
  }): Promise<Item[]> {
    return request<Item[]>(
      '/api/schedule/interleaved-block',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      },
      0
    );
  },

  // Attempt Recording
  async recordAttempt(attempt: Partial<ActivityAttempt>) {
    return request<any>(
      '/api/attempts',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attempt),
      },
      0
    );
  },

  async getAttempts(): Promise<ActivityAttempt[]> {
    return request<ActivityAttempt[]>('/api/attempts');
  },

  // Errors
  async getErrors(status?: string): Promise<ErrorLog[]> {
    const url = status ? `/api/errors?status=${status}` : '/api/errors';
    return request<ErrorLog[]>(url);
  },

  async updateError(id: string, updates: Partial<ErrorLog>): Promise<ErrorLog> {
    return request<ErrorLog>(
      `/api/errors/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      },
      0
    );
  },

  // Sessions
  async getSessions(): Promise<Session[]> {
    return request<Session[]>('/api/sessions');
  },

  async createSession(session: Partial<Session>): Promise<Session> {
    return request<Session>(
      '/api/sessions',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      },
      0
    );
  },

  // AI Helpers
  async aiExtractSet(
    text: string,
    articleRef?: string
  ): Promise<{
    clusters: Array<Partial<Cluster> & { temp_id: string }>;
    atoms: Array<Partial<Atom> & { temp_cluster_id?: string }>;
    confusionPairs: Array<Partial<ConfusionPair>>;
    detectedLegalBasis?: string;
    summary: string;
  }> {
    return request(
      '/api/ai/extract-set',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, articleRef }),
      },
      0
    );
  },

  async aiExtractAtoms(text: string): Promise<Partial<Atom>[]> {
    return request<Partial<Atom>[]>(
      '/api/ai/extract-atoms',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      },
      0
    );
  },

  // --- Local-first import pipeline (offline, no AI) ---

  async importPdf(filename: string, dataBase64: string): Promise<{
    filename?: string;
    pageCount: number;
    pages: Array<{ pageNumber: number; text: string }>;
    fullText: string;
  }> {
    return request('/api/import/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, data_base64: dataBase64 }),
    });
  },

  async suggestAtomsOffline(text: string): Promise<{
    suggestions: Array<{
      text: string;
      atom_type: Atom['atom_type'];
      legal_basis?: string;
      matched_markers: string[];
      confidence: number;
    }>;
    stats: { total_sentences: number; by_type: Record<string, number> };
  }> {
    return request('/api/import/suggest-atoms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
  },

  async splitChunks(input: { text?: string; pages?: Array<{ pageNumber: number; text: string }> }): Promise<{
    chunks: Array<{ raw_text: string; page_number?: number; article_reference?: string; order_index: number }>;
  }> {
    return request('/api/import/chunk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  },

  async aiDraftItem(atom: Atom, itemType: string): Promise<Partial<Item>> {
    return request<Partial<Item>>(
      '/api/ai/draft-item',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ atom, itemType }),
      },
      0
    );
  },

  async aiChat(params: {
    messages: ChatMessage[];
    provider?: 'gemini' | 'openrouter';
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
    return request(
      '/api/ai/chat',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      },
      0
    );
  },

  // Jev (TypeSafe Decision Model on OpenRouter) API methods
  async runJevDecisions(
    state: Record<string, any> | string,
    questions: Record<string, JevQuestion>,
    model?: string
  ): Promise<JevDecisionResponse> {
    return request<JevDecisionResponse>(
      '/api/jev/decisions',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state, questions, model }),
      },
      0
    );
  },

  async auditItemWithJev(item: any, sourceNorm?: string): Promise<JevItemAuditResult> {
    return request<JevItemAuditResult>(
      '/api/jev/audit-item',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item, sourceNorm }),
      },
      0
    );
  },

  async diagnoseAttemptWithJev(attemptData: any): Promise<JevAttemptDiagnosisResult> {
    return request<JevAttemptDiagnosisResult>(
      '/api/jev/diagnose-attempt',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attemptData),
      },
      0
    );
  },

  async classifyAtomWithJev(atomData: any): Promise<JevAtomClassificationResult> {
    return request<JevAtomClassificationResult>(
      '/api/jev/classify-atom',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(atomData),
      },
      0
    );
  },

  async verifyCascadeWithJev(
    draftItem: any,
    sourceText: string
  ): Promise<JevCascadeVerificationResult> {
    return request<JevCascadeVerificationResult>(
      '/api/jev/verify-cascade',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftItem, sourceText }),
      },
      0
    );
  },

  // Export Anki
  async getAnkiExport(topicId?: string): Promise<{
    mcqTsv: string;
    clozeTsv: string;
    contrastTsv: string;
    numberSortTsv: string;
    spotErrorTsv: string;
  }> {
    const url = topicId ? `/api/export/anki?topic_id=${topicId}` : '/api/export/anki';
    return request<any>(url);
  },

  async restoreBackup(backupData: any): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(
      '/api/import/backup',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backupData),
      },
      0
    );
  },
};
