// Semantic search package
export interface SemanticVector {
  values: number[];
  dimension: number;
}

export interface SearchResult {
  id: string;
  score: number;
  metadata?: Record<string, any>;
}

export function createVector(text: string): SemanticVector {
  // Simple text vectorization (in real implementation, use proper embedding model)
  const words = text.toLowerCase().split(/\s+/);
  const vector = new Array(128).fill(0);
  
  words.forEach(word => {
    const hash = word.split('').reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) & 0xffffffff;
    }, 0);
    const index = Math.abs(hash) % 128;
    vector[index] += 1;
  });
  
  // Normalize vector
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < vector.length; i++) {
      vector[i] /= magnitude;
    }
  }
  
  return {
    values: vector,
    dimension: 128,
  };
}

export function cosineSimilarity(a: SemanticVector, b: SemanticVector): number {
  if (a.dimension !== b.dimension) {
    throw new Error('Vectors must have the same dimension');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.dimension; i++) {
    dotProduct += a.values[i] * b.values[i];
    normA += a.values[i] * a.values[i];
    normB += b.values[i] * b.values[i];
  }
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function search(
  query: string,
  documents: Array<{ id: string; text: string; metadata?: Record<string, any> }>,
  topK: number = 10
): SearchResult[] {
  const queryVector = createVector(query);
  
  const results = documents.map(doc => {
    const docVector = createVector(doc.text);
    const score = cosineSimilarity(queryVector, docVector);
    
    return {
      id: doc.id,
      score,
      metadata: doc.metadata,
    };
  });
  
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}