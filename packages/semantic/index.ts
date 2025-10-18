const index = new Map<string, number[]>();

const VECTOR_SIZE = 16;

function normalize(text: string): string {
  return text.normalize('NFKD').toLowerCase().replace(/\s+/g, ' ').trim();
}

export const embed = (text: string): number[] => {
  const normalized = normalize(text);
  if (!normalized) {
    return Array.from({ length: VECTOR_SIZE }, () => 0);
  }
  const bytes = Array.from(normalized).map((char) => char.codePointAt(0) ?? 0);
  const length = bytes.length;
  return Array.from({ length: VECTOR_SIZE }, (_, i) => {
    const value = bytes[i % length];
    return ((value % 257) / 257) * Math.cos((i + 1) / VECTOR_SIZE);
  });
};

export function insert(id: string, text: string): void {
  index.set(id, embed(text));
}

function dotProduct(a: number[], b: number[]): number {
  const length = Math.min(a.length, b.length);
  let score = 0;
  for (let i = 0; i < length; i += 1) {
    score += a[i] * b[i];
  }
  return score;
}

export function search(query: string, limit = 5): Array<{ id: string; score: number }> {
  const queryVector = embed(query);
  return Array.from(index.entries())
    .map(([id, vector]) => ({ id, score: dotProduct(queryVector, vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function clear(): void {
  index.clear();
}
