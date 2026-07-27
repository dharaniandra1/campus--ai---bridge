const axios = require("axios");

const generateResponse = async (prompt) => {

  const response = await axios.post(
    "http://localhost:11434/api/generate",
    {
      model: process.env.MODEL_NAME,
      prompt: prompt,
      stream: false
    }
  );

const aiText = text;};

module.exports = generateResponse;