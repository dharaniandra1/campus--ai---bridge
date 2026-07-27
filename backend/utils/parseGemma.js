function parseGemmaJSON(aiText) {
  try {
    if (!aiText) {
      return {};
    }

    let cleanedText = aiText.trim();

    // Remove markdown JSON block markers from Gemma response
    cleanedText = cleanedText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Find only the JSON object part
    const startIndex = cleanedText.indexOf("{");
    const endIndex = cleanedText.lastIndexOf("}");

    if (startIndex === -1 || endIndex === -1) {
      throw new Error("JSON object not found in AI response");
    }

    const jsonText = cleanedText.substring(startIndex, endIndex + 1);

    return JSON.parse(jsonText);
  } catch (error) {
    console.log("Gemma JSON Parse Error:", error.message);

    return {
      summary: "AI generated a response, but it could not be formatted correctly.",
      score: 0,
      level: "Unknown",
      strengths: [],
      missingSkills: [],
      recommendations: [],
      roadmap: [],
      questions: [],
      feedback: ""
    };
  }
}

module.exports = parseGemmaJSON;