const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("Fetching models...");
    
    // We can fetch via raw REST API since the SDK's listModels might not be available or might filter
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log("Available models:", data.models.map(m => m.name));
  } catch (err) {
    console.error("Error:", err);
  }
}

listModels();
