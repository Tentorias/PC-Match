import { GoogleGenerativeAI } from "@google/generative-ai";

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

/**
 * Envia uma mensagem para o modelo Gemini com o histórico do chat
 */
export async function sendChatMessage(
  message: string,
  history: GeminiMessage[] = []
) {
  const currentApiKey = process.env.GEMINI_API_KEY || "";
  if (!currentApiKey) {
    return {
      text: "Erro: A chave de API do Gemini não está configurada no servidor (GEMINI_API_KEY).",
      recommendedComponents: []
    };
  }

  const genAI = new GoogleGenerativeAI(currentApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  const chat = model.startChat({
    history: history,
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1000,
    },
  });

  try {
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();
    return {
      text: responseText,
    };
  } catch (error) {
    console.error("Erro ao chamar o Gemini:", error);
    return {
      text: "Desculpe, ocorreu um erro ao processar sua mensagem."
    };
  }
}

/**
 * Chama o Gemini solicitando JSON (usado para NLP e Admin)
 */
export async function getJsonFromGemini(prompt: string, schema: string): Promise<any> {
  const currentApiKey = process.env.GEMINI_API_KEY || "";
  if (!currentApiKey) {
    throw new Error("GEMINI_API_KEY não configurada.");
  }
  
  const genAI = new GoogleGenerativeAI(currentApiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-3.5-flash",
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    }
  });

  const fullPrompt = `${prompt}\n\nRetorne EXATAMENTE UM objeto JSON seguindo esta estrutura:\n${schema}`;

  const result = await model.generateContent(fullPrompt);
  let text = result.response.text();
  
  // O Gemini 3.5 pode acabar envolvendo o JSON em blocos de markdown, mesmo com responseMimeType
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Falha ao fazer parse do JSON do Gemini", text);
    throw new Error("O Gemini não retornou um JSON válido.");
  }
}
