import { openDB } from 'idb';

const dbPromise = openDB('ai-bridge', 1, {
  upgrade(db) {
    db.createObjectStore('memories', { keyPath: 'id' });
  }
});

export async function saveMemory(text, embedding) {
  const db = await dbPromise;
  await db.put('memories', {
    id: Date.now(),
    text,
    embedding,
    created: new Date().toISOString()
  });
}

export async function getAllMemories() {
  const db = await dbPromise;
  return await db.getAll('memories');
}
