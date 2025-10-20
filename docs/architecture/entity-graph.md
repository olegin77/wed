# Entity graph scaffold

- **Module:** `packages/graph/index.ts`
- **API:** `link(from, to)`, `unlink(from, to)`, `neighbors(node)`, and `clear()`.
- **Storage:** In-memory `Map<NodeId, Set<NodeId>>` representing outbound edges.
- **Usage:** Ideal for experiments (e.g., related vendors or venues) before wiring a persistent graph database.
- **Reset:** Call `clear()` in tests to drop the adjacency map.
