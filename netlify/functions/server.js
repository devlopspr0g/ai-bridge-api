import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let memories = [];

app.get('/', (req, res) => {
  res.json({ name: "AI-Bridge API", dims: 384, status: "live on Netlify" });
});

app.post('/save', (req, res) => {
  const { text } = req.body;
  memories.push({ id: Date.now(), text, created: new Date().toISOString() });
  res.json({ ok: true, total: memories.length });
});

app.post('/search', (req, res) => {
  const { query } = req.body;
  const results = memories.filter(m => 
    m.text.toLowerCase().includes(query.toLowerCase())
  ).slice(0,5);
  res.json(results);
});

export const handler = serverless(app);
