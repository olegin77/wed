export interface SearchDocument<TPayload> {
  id: string;
  text: string;
  payload: TPayload;
}

export interface SearchOptions {
  maxResults?: number;
  minScore?: number;
}

export interface SearchResult<TPayload> {
  id: string;
  score: number;
  payload: TPayload;
  matches: string[];
}

interface IndexedDocument<TPayload> {
  payload: TPayload;
  tokenCount: number;
  termFrequency: Map<string, number>;
}

const STOP_WORDS = new Set([
  // English
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "have",
  "he",
  "her",
  "him",
  "his",
  "i",
  "in",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "our",
  "she",
  "that",
  "the",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "to",
  "was",
  "we",
  "were",
  "with",
  "you",
  // Russian
  "а",
  "без",
  "более",
  "бы",
  "был",
  "были",
  "было",
  "быть",
  "в",
  "вам",
  "вас",
  "весь",
  "во",
  "вот",
  "все",
  "всего",
  "всех",
  "вы",
  "где",
  "да",
  "даже",
  "для",
  "до",
  "его",
  "ее",
  "ей",
  "ему",
  "если",
  "есть",
  "еще",
  "её",
  "ж",
  "же",
  "за",
  "здесь",
  "из",
  "или",
  "им",
  "их",
  "к",
  "как",
  "когда",
  "который",
  "ли",
  "либо",
  "лишь",
  "между",
  "меня",
  "мы",
  "на",
  "над",
  "нам",
  "нас",
  "не",
  "него",
  "нее",
  "ней",
  "нём",
  "нет",
  "ни",
  "них",
  "но",
  "ну",
  "о",
  "об",
  "однако",
  "он",
  "она",
  "они",
  "оно",
  "от",
  "по",
  "под",
  "при",
  "про",
  "раз",
  "с",
  "со",
  "так",
  "также",
  "там",
  "то",
  "тогда",
  "только",
  "ты",
  "у",
  "уже",
  "чтобы",
  "эта",
  "эти",
  "это",
  "я",
  // Uzbek (mixed Latin/Cyrillic)
  "va",
  "ham",
  "bilan",
  "uchun",
  "emas",
  "men",
  "sen",
  "biz",
  "siz",
  "ular",
  "bu",
  "shu",
  "oʻsha",
  "o'sha",
  "ozi",
  "endi",
  "yana",
  "bilanoq",
  "nega",
  "lekin",
]);

const TOKEN_PATTERN = /\p{L}[\p{L}\p{N}]*/gu;

function normalize(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function tokenize(text: string): string[] {
  const normalized = normalize(text);
  const matches = normalized.match(TOKEN_PATTERN);
  if (!matches) {
    return [];
  }
  const tokens: string[] = [];
  for (const token of matches) {
    if (!STOP_WORDS.has(token) && token.length > 1) {
      tokens.push(token);
    }
  }
  return tokens;
}

function buildTermFrequency(tokens: string[]): Map<string, number> {
  const frequency = new Map<string, number>();
  for (const token of tokens) {
    frequency.set(token, (frequency.get(token) ?? 0) + 1);
  }
  return frequency;
}

export class InMemorySearchIndex<TPayload> {
  private readonly documents = new Map<string, IndexedDocument<TPayload>>();

  private readonly documentFrequency = new Map<string, number>();

  private totalDocuments = 0;

  add(document: SearchDocument<TPayload>): void {
    this.remove(document.id);
    const tokens = tokenize(document.text);
    const indexed: IndexedDocument<TPayload> = {
      payload: document.payload,
      tokenCount: tokens.length,
      termFrequency: buildTermFrequency(tokens),
    };
    this.documents.set(document.id, indexed);
    this.totalDocuments += 1;
    const uniqueTokens = new Set(tokens);
    for (const token of uniqueTokens) {
      this.documentFrequency.set(token, (this.documentFrequency.get(token) ?? 0) + 1);
    }
  }

  remove(id: string): void {
    const existing = this.documents.get(id);
    if (!existing) {
      return;
    }
    this.documents.delete(id);
    this.totalDocuments -= 1;
    for (const token of existing.termFrequency.keys()) {
      const current = this.documentFrequency.get(token);
      if (!current) {
        continue;
      }
      if (current <= 1) {
        this.documentFrequency.delete(token);
      } else {
        this.documentFrequency.set(token, current - 1);
      }
    }
  }

  clear(): void {
    this.documents.clear();
    this.documentFrequency.clear();
    this.totalDocuments = 0;
  }

  search(query: string, options: SearchOptions = {}): SearchResult<TPayload>[] {
    if (!query.trim()) {
      return [];
    }
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) {
      return [];
    }
    const uniqueQueryTokens = new Set(queryTokens);
    const results: SearchResult<TPayload>[] = [];
    for (const [id, document] of this.documents) {
      let score = 0;
      const matches: string[] = [];
      for (const token of uniqueQueryTokens) {
        const termFrequency = document.termFrequency.get(token);
        if (!termFrequency) {
          continue;
        }
        const tf = termFrequency / Math.max(document.tokenCount, 1);
        const df = this.documentFrequency.get(token) ?? 0;
        const idf = Math.log(1 + this.totalDocuments / (1 + df));
        score += tf * idf;
        matches.push(token);
      }
      if (score === 0) {
        continue;
      }
      const normalizedScore = score / uniqueQueryTokens.size;
      results.push({
        id,
        score: normalizedScore,
        payload: document.payload,
        matches,
      });
    }
    const maxResults = options.maxResults ?? 10;
    const minScore = options.minScore ?? 0;
    return results
      .filter((result) => result.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }
}

export function createSearchIndex<TPayload>(documents: SearchDocument<TPayload>[] = []): InMemorySearchIndex<TPayload> {
  const index = new InMemorySearchIndex<TPayload>();
  for (const document of documents) {
    index.add(document);
  }
  return index;
}

export function rank(query: string, text: string): number {
  const index = createSearchIndex([{ id: "__single__", text, payload: null }]);
  const [result] = index.search(query, { maxResults: 1 });
  return result?.score ?? 0;
}

export function extractKeywords(text: string, limit = 5): string[] {
  const tokens = tokenize(text);
  if (tokens.length === 0) {
    return [];
  }
  const frequency = buildTermFrequency(tokens);
  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([token]) => token);
}

export const utils = {
  tokenize,
  normalize,
};
