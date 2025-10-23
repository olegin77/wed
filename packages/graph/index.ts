// Graph package
export interface Node {
  id: string;
  data?: Record<string, any>;
}

export interface Edge {
  from: string;
  to: string;
  weight?: number;
  data?: Record<string, any>;
}

export interface Graph {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
  adjacencyList: Map<string, Set<string>>;
}

export function createGraph(): Graph {
  return {
    nodes: new Map(),
    edges: new Map(),
    adjacencyList: new Map(),
  };
}

export function addNode(graph: Graph, node: Node): void {
  graph.nodes.set(node.id, node);
  if (!graph.adjacencyList.has(node.id)) {
    graph.adjacencyList.set(node.id, new Set());
  }
}

export function addEdge(graph: Graph, edge: Edge): void {
  const edgeId = `${edge.from}-${edge.to}`;
  graph.edges.set(edgeId, edge);
  
  if (!graph.adjacencyList.has(edge.from)) {
    graph.adjacencyList.set(edge.from, new Set());
  }
  if (!graph.adjacencyList.has(edge.to)) {
    graph.adjacencyList.set(edge.to, new Set());
  }
  
  graph.adjacencyList.get(edge.from)!.add(edge.to);
}

export function removeNode(graph: Graph, nodeId: string): void {
  graph.nodes.delete(nodeId);
  graph.adjacencyList.delete(nodeId);
  
  // Remove all edges connected to this node
  for (const [edgeId, edge] of graph.edges.entries()) {
    if (edge.from === nodeId || edge.to === nodeId) {
      graph.edges.delete(edgeId);
    }
  }
  
  // Remove from adjacency lists
  for (const neighbors of graph.adjacencyList.values()) {
    neighbors.delete(nodeId);
  }
}

export function removeEdge(graph: Graph, from: string, to: string): void {
  const edgeId = `${from}-${to}`;
  graph.edges.delete(edgeId);
  graph.adjacencyList.get(from)?.delete(to);
}

export function getNeighbors(graph: Graph, nodeId: string): string[] {
  return Array.from(graph.adjacencyList.get(nodeId) || []);
}

export function hasEdge(graph: Graph, from: string, to: string): boolean {
  return graph.adjacencyList.get(from)?.has(to) || false;
}

export function getEdge(graph: Graph, from: string, to: string): Edge | undefined {
  const edgeId = `${from}-${to}`;
  return graph.edges.get(edgeId);
}

export function getAllNodes(graph: Graph): Node[] {
  return Array.from(graph.nodes.values());
}

export function getAllEdges(graph: Graph): Edge[] {
  return Array.from(graph.edges.values());
}

export const edges = getAllEdges;
export const link = addEdge;

export function findPath(
  graph: Graph,
  start: string,
  end: string,
  visited: Set<string> = new Set()
): string[] | null {
  if (start === end) {
    return [start];
  }
  
  if (visited.has(start)) {
    return null;
  }
  
  visited.add(start);
  
  const neighbors = getNeighbors(graph, start);
  for (const neighbor of neighbors) {
    const path = findPath(graph, neighbor, end, new Set(visited));
    if (path) {
      return [start, ...path];
    }
  }
  
  return null;
}

export function getConnectedComponents(graph: Graph): string[][] {
  const visited = new Set<string>();
  const components: string[][] = [];
  
  for (const nodeId of graph.nodes.keys()) {
    if (!visited.has(nodeId)) {
      const component: string[] = [];
      const stack = [nodeId];
      
      while (stack.length > 0) {
        const current = stack.pop()!;
        if (!visited.has(current)) {
          visited.add(current);
          component.push(current);
          
          const neighbors = getNeighbors(graph, current);
          for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
              stack.push(neighbor);
            }
          }
        }
      }
      
      components.push(component);
    }
  }
  
  return components;
}