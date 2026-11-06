exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const path = event.path || "/";

  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        name: "AI-Bridge API", 
        status: "live", 
        endpoint: "https://aibridge-api.netlify.app",
        time: new Date().toISOString()
      })
    };
  }

  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body || "{}");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, saved: body, message: "Saved from Enugu!" })
      };
    } catch(e) {
      return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: e.message }) };
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
};
