# AI-Bridge API
Offline-first memory for any AI chat.

- 384-dims (all-MiniLM-L6-v2) — fast on phone
- IndexedDB — survives NEPA / no network
- API-first — any app can POST /save, POST /search

## Core
POST /save { text }
POST /search { query } -> top 5 memories
