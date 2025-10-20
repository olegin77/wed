export type NodeId = string;

/**
 * Directed adjacency list stored in-memory for quick prototyping.
 */
const edges = new Map<NodeId, Set<NodeId>>();

/**
 * Connects two nodes with a directed edge.
 */
export function link(from: NodeId, to: NodeId) {
  if (!edges.has(from)) {
    edges.set(from, new Set());
  }
  edges.get(from)!.add(to);
}

/**
 * Removes the directed edge between two nodes if it exists.
 */
export function unlink(from: NodeId, to: NodeId) {
  const set = edges.get(from);
  if (!set) {
    return;
  }
  set.delete(to);
  if (set.size === 0) {
    edges.delete(from);
  }
}

/**
 * Returns the outbound neighbours for a given node.
 */
export function neighbors(node: NodeId): NodeId[] {
  return Array.from(edges.get(node) ?? []);
}

/**
 * Drops the entire adjacency map. Useful for tests.
 */
export function clear() {
  edges.clear();
}
