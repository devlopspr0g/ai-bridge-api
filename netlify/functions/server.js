const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const store = getStore("memories");

  // GET /api/ -> list permanent memories
  if (event.httpMethod === "GET") {
    const memories = (await store.get("all", { type: "json" })) || [];
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        name: "AI-Bridge API",
        status: "live - permanent",
        count: memories.length,
        memories: memories,
        time: new Date().toISOString()
      })
    };
  }

  // POST /api/ -> save permanently
  if (event.httpMethod === "POST") {
    try {
      const { text, embedding } = JSON.parse(event.body || "{}");
      if (!text) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "text required" }) };
      }
      const memories = (await store.get("all", { type: "json" })) || [];
      const newMemory = {
        id: Date.now(),
        text,
        embedding: embedding || null,
        created: new Date().toISOString()
      };
      memories.push(newMemory);
      await store.setJSON("all", memories);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, permanent: true, saved: newMemory, count: memories.length })
      };
    } catch (e) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  // DELETE /api/ -> clear all
  if (event.httpMethod === "DELETE") {
    await store.setJSON("all", []);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, cleared: true }) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
};
