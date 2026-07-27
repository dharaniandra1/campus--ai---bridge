const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Campus AI Bridge"
  }
});

const generateResponse = async (prompt) => {
  const response = await client.chat.completions.create({
    model:
      process.env.OPENROUTER_MODEL ||
      "meta-llama/llama-3.3-70b-instruct:free",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.2
  });

  return response.choices?.[0]?.message?.content || "";
};

module.exports = { generateResponse };