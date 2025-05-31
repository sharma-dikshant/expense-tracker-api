const fs = require("fs");
const { GoogleGenAI, Type } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let prompt = "Generate a report";
try {
  prompt = fs.readFileSync("./promptForSummaryGeneration.txt", "utf-8");
} catch (error) {
  console.log("Error in fetching prompt");
}

exports.generateYearlySummary = async (report) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-05-20",
    contents: JSON.stringify(report),
    config: {
      systemInstruction: prompt,
    },
  });

  return response.text;
};
