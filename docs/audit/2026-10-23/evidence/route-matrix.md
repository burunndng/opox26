# Route matrix (generated)

Generated: 2026-10-23T01:43:19.091Z
Source: server.ts @ git 71935c2

Total routes: **58** — zod: **16**, manual: **0**, none: **42**

## Routes with a request body and NO validation guard

- `POST /api/schedule/interleaved-block` (server.ts:282)
- `POST /api/sessions/save-state` (server.ts:329)
- `POST /api/ai/extract-set` (server.ts:347)
- `POST /api/ai/extract-atoms` (server.ts:360)
- `POST /api/ai/draft-item` (server.ts:373)
- `POST /api/ai/chat` (server.ts:386)
- `POST /api/jev/decisions` (server.ts:407)
- `POST /api/jev/audit-item` (server.ts:420)
- `POST /api/jev/diagnose-attempt` (server.ts:433)
- `POST /api/jev/classify-atom` (server.ts:443)
- `POST /api/jev/verify-cascade` (server.ts:453)
- `POST /api/jev/compare` (server.ts:467)
- `POST /api/import/backup` (server.ts:489)

## Full matrix

| line | method | route | zod schema | guard | body | query | status codes |
|---|---|---|---|---|---|---|---|
| 78 | GET | `/api/health` | `—` | NONE | no | no | — |
| 83 | GET | `/api/settings` | `—` | NONE | no | no | — |
| 87 | PUT | `/api/settings` | `settingsUpdateInput` | zod | yes | no | — |
| 95 | GET | `/api/topics` | `—` | NONE | no | no | — |
| 99 | GET | `/api/topics/:id` | `—` | NONE | no | no | 404 |
| 105 | POST | `/api/topics` | `topicInput` | zod | yes | no | 201 |
| 112 | PUT | `/api/topics/:id` | `topicInput.partial()` | zod | yes | no | 404 |
| 120 | DELETE | `/api/topics/:id` | `—` | NONE | no | no | — |
| 126 | GET | `/api/source-chunks` | `—` | NONE | no | yes | — |
| 131 | POST | `/api/source-chunks` | `sourceChunkInput` | zod | yes | no | 201 |
| 139 | POST | `/api/import/pdf` | `pdfImportInput` | zod | yes | no | 422,500 |
| 155 | POST | `/api/import/suggest-atoms` | `suggestAtomsInput` | zod | yes | no | — |
| 165 | POST | `/api/import/chunk` | `chunkSplitInput` | zod | yes | no | — |
| 173 | GET | `/api/atoms` | `—` | NONE | no | yes | — |
| 182 | POST | `/api/atoms` | `atomInput` | zod | yes | no | 201 |
| 189 | PUT | `/api/atoms/:id` | `atomInput.partial()` | zod | yes | no | 404 |
| 197 | DELETE | `/api/atoms/:id` | `—` | NONE | no | no | — |
| 203 | GET | `/api/clusters` | `—` | NONE | no | yes | — |
| 208 | POST | `/api/clusters` | `clusterInput` | zod | yes | no | 201 |
| 216 | GET | `/api/confusion-pairs` | `—` | NONE | no | yes | — |
| 221 | POST | `/api/confusion-pairs` | `confusionPairInput` | zod | yes | no | 201 |
| 229 | GET | `/api/items` | `—` | NONE | no | yes | — |
| 240 | GET | `/api/items/validation-warnings` | `—` | NONE | no | no | — |
| 244 | GET | `/api/items/:id` | `—` | NONE | no | no | 404 |
| 250 | POST | `/api/items` | `itemInput` | zod | yes | no | 201 |
| 257 | PUT | `/api/items/:id` | `itemInput.partial()` | zod | yes | no | 404 |
| 265 | DELETE | `/api/items/:id` | `—` | NONE | no | no | — |
| 271 | GET | `/api/schedule/stats` | `—` | NONE | no | yes | — |
| 276 | GET | `/api/schedule/due-queue` | `—` | NONE | no | yes | — |
| 282 | POST | `/api/schedule/interleaved-block` | `—` | NONE | yes | no | — |
| 288 | POST | `/api/attempts` | `attemptInput` | zod | yes | no | 201 |
| 295 | GET | `/api/attempts` | `—` | NONE | no | no | — |
| 300 | GET | `/api/errors` | `—` | NONE | no | yes | — |
| 305 | PUT | `/api/errors/:id` | `errorLogUpdateInput` | zod | yes | no | 404 |
| 314 | GET | `/api/sessions` | `—` | NONE | no | no | — |
| 318 | POST | `/api/sessions` | `sessionInput` | zod | yes | no | 201 |
| 325 | GET | `/api/sessions/saved-state` | `—` | NONE | no | no | — |
| 329 | POST | `/api/sessions/save-state` | `—` | NONE | yes | no | — |
| 334 | DELETE | `/api/sessions/saved-state` | `—` | NONE | no | no | — |
| 339 | GET | `/api/sessions/:id/export` | `—` | NONE | no | no | 404 |
| 347 | POST | `/api/ai/extract-set` | `—` | NONE | yes | no | 400,500 |
| 360 | POST | `/api/ai/extract-atoms` | `—` | NONE | yes | no | 400,500 |
| 373 | POST | `/api/ai/draft-item` | `—` | NONE | yes | no | 400,500 |
| 386 | POST | `/api/ai/chat` | `—` | NONE | yes | no | 400,500 |
| 407 | POST | `/api/jev/decisions` | `—` | NONE | yes | no | 400,500 |
| 420 | POST | `/api/jev/audit-item` | `—` | NONE | yes | no | 400,500 |
| 433 | POST | `/api/jev/diagnose-attempt` | `—` | NONE | yes | no | 500 |
| 443 | POST | `/api/jev/classify-atom` | `—` | NONE | yes | no | 500 |
| 453 | POST | `/api/jev/verify-cascade` | `—` | NONE | yes | no | 400,500 |
| 467 | POST | `/api/jev/compare` | `—` | NONE | yes | no | 400,500 |
| 483 | GET | `/api/export/backup` | `—` | NONE | no | no | — |
| 489 | POST | `/api/import/backup` | `—` | NONE | yes | no | 400 |
| 498 | GET | `/api/export/anki` | `—` | NONE | no | yes | — |
| 503 | GET | `/api/export/csv-items` | `—` | NONE | no | yes | — |
| 510 | GET | `/api/export/csv-errors` | `—` | NONE | no | no | — |
| 516 | GET | `/api/export/quizlet` | `—` | NONE | no | yes | — |
| 523 | GET | `/api/export/analytics-md` | `—` | NONE | no | no | — |
| 539 | GET | `*` | `—` | NONE | no | no | — |
