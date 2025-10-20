# @wt/semantic overview

`@wt/semantic` exposes a lightweight semantic index that approximates cosine similarity search without relying on an external
vector database. The package ships deterministic pseudo-embeddings, in-memory storage, and helper utilities that let services
experiment with semantic ranking while keeping operational overhead minimal.

## Key capabilities

- **Deterministic embeddings** – `embed(text, dimensions?)` lowercases the input, hashes character trigrams across a configurable
  vector space, and normalises the output to unit length so cosine similarity equals the dot product.
- **In-memory document registry** – `insert(id, text, options?)` stores vectors alongside the source text and optional payload,
  while `remove(id)` and `clear()` manage lifecycle.
- **Runtime search** – `search(query, { limit, minScore, dimensions })` executes cosine-similarity queries and returns the
  highest scoring documents ordered by relevance.
- **Observability helpers** – `snapshot()` exposes a serialisable view of the current index, useful for debugging during local
  experiments.

## Usage example

```ts
import { insert, search, clear } from "@wt/semantic";

insert("venue-123", "Loft wedding venue in central Tashkent", { payload: { slug: "loft-tashkent" } });
insert("venue-456", "Свадебный ресторан в Чиланзаре с летней террасой", { payload: { slug: "restaurant-chilanzar" } });

const results = search("summer terrace wedding venue tashkent", { limit: 3, minScore: 0.2 });

// results → [
//   { id: "venue-123", score: 0.61, payload: { slug: "loft-tashkent" }, text: "Loft wedding venue..." },
//   ...
// ]

clear();
```

## Catalog integration

`apps/svc-catalog/src/semantic/index-vendors.ts` exposes `indexVendor()` and `reindex()` helpers that bridge catalogue vendors
into the shared semantic index. The helper concatenates the vendor title, city, type, tags, and description to produce the
searchable surface. Passing `{ includePayload: true }` to either function stores the vendor id/score metadata alongside the
embedding so downstream rankers can surface additional context.

## Integration notes

- The embedding function is deterministic; identical text inputs always yield identical vectors, making the module safe for
  snapshotting during tests.
- Consumers can provide pre-computed vectors via `insert(id, text, { vector })` when experimenting with external embedding
  services.
- The module is intentionally synchronous and in-memory. Production deployments that require persistence should flush snapshots
  via `snapshot()` and restore them during service start-up.
