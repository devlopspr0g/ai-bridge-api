import express from 'express';
import cors from 'cors';
import { save, search } from './api.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/save', async (req, res) => {
  const { text } = req.body;
  const result = await save(text);
  res.json(result);
});

app.post('/search', async (req, res) => {
  const { query } = req.body;
  const results = await search(query);
  res.json(results);
});

app.get('/', (req, res) => {
  res.json({ name: "AI-Bridge API", dims: 384, status: "offline-first ready" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`AI-Bridge API on ${port}`));
