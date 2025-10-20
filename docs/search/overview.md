# @wt/search overview

`@wt/search` ships an in-memory token index that powers lightweight full-text search flows without relying on external engines. It
normalises multilingual content (Latin, Cyrillic, Uzbek-specific characters), strips stop-words, and uses a TF-IDF-inspired
scoring function to rank matches.

## Key capabilities

- **Index builder** – `createSearchIndex` accepts pre-seeded documents and returns an `InMemorySearchIndex` that can add, remove,
  clear, and query entries at runtime.
- **Relevance scoring** – `search(query, options)` tokenises the query, filters stop-words, and emits results ordered by their
  weighted score (term frequency adjusted by document frequency).
- **Keyword extraction** – `extractKeywords` returns the most frequently occurring tokens from arbitrary text, useful for
  generating filters and search suggestions.
- **Utility helpers** – exposed `utils.normalize` and `utils.tokenize` functions ensure consistent text preparation between
  indexing and downstream consumers.

## Usage example

```ts
import { createSearchIndex } from "@wt/search";

const index = createSearchIndex([
  { id: "venue-1", text: "Лофт с панорамными окнами в центре Ташкента", payload: { slug: "loft-panorama" } },
  { id: "venue-2", text: "Garden wedding venue with outdoor ceremony area", payload: { slug: "garden-venue" } },
]);

const results = index.search("сад церемония ташкент", { maxResults: 5 });
```

`results` will contain both venues ordered by relevance, including the matched tokens so UI layers can highlight them.
