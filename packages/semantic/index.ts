export const DEFAULT_DIMENSIONS = 32;

export type SemanticVector = number[];

export interface SemanticDocument<TPayload = unknown> {
  id: string;
  text: string;
  vector: SemanticVector;
  payload?: TPayload;
}

export interface InsertOptions<TPayload> {
  payload?: TPayload;
  vector?: SemanticVector;
  dimensions?: number;
}

export interface SearchOptions {
  limit?: number;
  minScore?: number;
  dimensions?: number;
}

export interface SearchResult<TPayload = unknown> {
  id: string;
  score: number;
  payload?: TPayload;
  text: string;
}

const index = new Map<string, SemanticDocument<unknown>>();

/**
 * Generates a deterministic pseudo-embedding for the provided text by hashing
 * character trigrams across a configurable vector space. The output is
 * normalised to unit length so cosine similarity is equivalent to the dot
 * product.
 */
export function embed(text: string, dimensions: number = DEFAULT_DIMENSIONS): SemanticVector {
  const safeDimensions = Number.isInteger(dimensions) && dimensions > 0 ? dimensions : DEFAULT_DIMENSIONS;
  const accumulator = new Array<number>(safeDimensions).fill(0);
  const normalised = text.toLowerCase().trim();

  if (normalised.length === 0) {
    return accumulator;
  }

  const trigramCounts = new Map<string, number>();
  for (let i = 0; i < normalised.length; i += 1) {
    const trigram = normalised.slice(i, i + 3);
    trigramCounts.set(trigram, (trigramCounts.get(trigram) ?? 0) + 1);
  }

  let totalWeight = 0;
  for (const [trigram, count] of trigramCounts.entries()) {
    const hash = hashTrigram(trigram);
    const bucket = hash % safeDimensions;
    const weight = count;
    totalWeight += weight * weight;
    accumulator[bucket] += weight;
  }

  if (totalWeight === 0) {
    return accumulator;
  }

  const magnitude = Math.sqrt(accumulator.reduce((sum, value) => sum + value * value, 0));
  if (magnitude === 0) {
    return accumulator;
  }

  for (let i = 0; i < accumulator.length; i += 1) {
    accumulator[i] = accumulator[i] / magnitude;
  }

  return accumulator;
}

function hashTrigram(value: string): number {
  let hash = 17;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Inserts or updates a document inside the in-memory semantic index.
 */
export function insert<TPayload = unknown>(id: string, text: string, options: InsertOptions<TPayload> = {}): void {
  const dimensions = options.dimensions ?? DEFAULT_DIMENSIONS;
  const vector = options.vector ?? embed(text, dimensions);
  index.set(id, { id, text, vector, payload: options.payload });
}

/**
 * Removes a document from the semantic index if it exists.
 */
export function remove(id: string): boolean {
  return index.delete(id);
}

function cosineSimilarity(a: SemanticVector, b: SemanticVector): number {
  const length = Math.max(a.length, b.length);
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < length; i += 1) {
    const valueA = a[i] ?? 0;
    const valueB = b[i] ?? 0;
    dot += valueA * valueB;
    normA += valueA * valueA;
    normB += valueB * valueB;
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Executes a cosine-similarity search for the provided query text and returns
 * the highest scoring documents.
 */
export function search<TPayload = unknown>(
  query: string,
  options: SearchOptions = {},
): SearchResult<TPayload>[] {
  const limit = options.limit ?? 5;
  const minScore = options.minScore ?? 0;
  const queryVector = embed(query, options.dimensions ?? DEFAULT_DIMENSIONS);

  const results: SearchResult<TPayload>[] = [];
  for (const document of index.values()) {
    const score = cosineSimilarity(queryVector, document.vector);
    if (score >= minScore) {
      results.push({ id: document.id, score, payload: document.payload as TPayload, text: document.text });
    }
  }

  results.sort((left, right) => right.score - left.score);
  return results.slice(0, Math.max(0, limit));
}

/**
 * Returns a serialisable snapshot of the current index for inspection or
 * debugging.
 */
export function snapshot(): SemanticDocument<unknown>[] {
  return Array.from(index.values()).map((document) => ({
    id: document.id,
    text: document.text,
    vector: [...document.vector],
    payload: document.payload,
  }));
}

/**
 * Clears the in-memory semantic index.
 */
export function clear(): void {
  index.clear();
}
