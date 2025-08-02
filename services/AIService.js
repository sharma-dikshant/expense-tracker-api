const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let promptToGenerateReport = "Generate a report";
try {
  promptToGenerateReport = fs.readFileSync(
    "./promptForSummaryGeneration.txt",
    "utf-8"
  );
} catch (error) {
  console.log("Error in fetching prompt");
}

exports.generateYearlySummary = async (report) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-05-20",
    contents: JSON.stringify(report),
    config: {
      systemInstruction: promptToGenerateReport,
    },
  });

  return response.text;
};

const promptToExpenseCommands =
  "just greet the user and say sorry that you are not able to perform action at this moment please try after sometime";

exports.voiceCommandforExpenses = async (command) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-05-20",
    contents: command,
    config: {
      systemInstruction: promptToExpenseCommands,
    },
  });

  return response.text;
};
