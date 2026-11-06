// Simple in-memory + file persistence for now (works on Netlify)
let memories = [];

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // GET /api/ -> list memories
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        name: "AI-Bridge API",
        status: "live",
        count: memories.length,
        memories: memories,
        time: new Date().toISOString()
      })
    };
  }

  // POST /api/ -> save memory
  if (event.httpMethod === "POST") {
    try {
      const { text, embedding } = JSON.parse(event.body || "{}");
      if (!text) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "text is required" }) };
      }
      const newMemory = {
        id: Date.now(),
        text,
        embedding: embedding || null,
        created: new Date().toISOString()
      };
      memories.push(newMemory);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, saved: newMemory })
      };
    } catch (e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
};
