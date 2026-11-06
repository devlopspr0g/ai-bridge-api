import { pipeline } from '@xenova/transformers';
import { saveMemory, getAllMemories } from './db.js';

const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

function cosine(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i]*a[i];
    magB += b[i]*b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export async function save(text) {
  const output = await embedder(text, { pooling: 'mean', normalize: true });
  const embedding = Array.from(output.data);
  await saveMemory(text, embedding);
  return { ok: true, dims: 384 };
}

export async function search(query) {
  const qOut = await embedder(query, { pooling: 'mean', normalize: true });
  const qEmb = Array.from(qOut.data);
  
  const memories = await getAllMemories();
  const scored = memories.map(m => ({
    text: m.text,
    score: cosine(qEmb, m.embedding),
    created: m.created
  })).sort((a,b) => b.score - a.score);

  return scored.slice(0, 5);
}
