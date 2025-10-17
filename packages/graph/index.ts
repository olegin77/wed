export type NodeId = string;

const edges = new Map<NodeId, Set<NodeId>>();

export function link(from: NodeId, to: NodeId) {
  if (!edges.has(from)) {
    edges.set(from, new Set());
  }
  edges.get(from)!.add(to);
}

export function unlink(from: NodeId, to: NodeId) {
  const set = edges.get(from);
  if (!set) return;
  set.delete(to);
  if (set.size === 0) {
    edges.delete(from);
  }
}

export function neighbors(node: NodeId): NodeId[] {
  return Array.from(edges.get(node) ?? []);
}

export function clear() {
  edges.clear();
}
