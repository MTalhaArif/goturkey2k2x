import { knowledgeBase, defaultChunkIds } from '@/lib/rag/knowledgeBase';

const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'to', 'of', 'in', 'on', 'for',
  'and', 'or', 'do', 'does', 'did', 'i', 'you', 'my', 'me', 'it', 'this', 'that', 'with',
  'what', 'how', 'can', 'could', 'would', 'should', 'will', 'about', 'need', 'want', 'have',
  'has', 'if', 'so', 'at', 'as', 'from', 'your', 'their', 'am', 'im', "i'm",
]);

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

const indexed = knowledgeBase.map((chunk) => ({
  ...chunk,
  titleTokens: new Set(tokenize(chunk.title)),
  keywordTokens: new Set(tokenize((chunk.keywords || []).join(' '))),
  contentTokens: tokenize(chunk.content),
}));

const chunkById = new Map(knowledgeBase.map((chunk) => [chunk.id, chunk]));

const MAX_CONTEXT_CHARS = 6000;

export function retrieveChunks(query, topK = 6) {
  const queryTokens = tokenize(query);

  let scored = [];
  if (queryTokens.length > 0) {
    scored = indexed
      .map((chunk) => {
        let score = 0;
        for (const token of queryTokens) {
          if (chunk.titleTokens.has(token)) score += 3;
          if (chunk.keywordTokens.has(token)) score += 2;
          if (chunk.contentTokens.includes(token)) score += 1;
        }
        return { chunk, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((entry) => entry.chunk);
  }

  if (scored.length === 0) {
    scored = defaultChunkIds.map((id) => chunkById.get(id)).filter(Boolean);
  }

  let totalChars = 0;
  const selected = [];
  for (const chunk of scored) {
    if (totalChars >= MAX_CONTEXT_CHARS) break;
    selected.push(chunk);
    totalChars += chunk.content.length;
  }

  return selected;
}

export function formatChunksForPrompt(chunks) {
  return chunks.map((chunk) => `### ${chunk.title}\n${chunk.content}`).join('\n\n');
}
