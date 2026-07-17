/**
 * Integração e prompts com a API do Gemini
 */

export interface GeminiMessage {
  role: "user" | "model";
  text: string;
}

export interface GeminiResponse {
  text: string;
  recommendedComponents?: string[];
}

/**
 * Envia uma mensagem para o modelo Gemini com o histórico do chat
 */
export async function sendChatMessage(
  message: string,
  history: GeminiMessage[] = []
): Promise<GeminiResponse> {
  // TODO: Integrar com o pacote oficial @google/generative-ai
  console.log("Enviando mensagem para o Gemini:", { message, historyLength: history.length });

  return {
    text: "Olá! Sou o assistente virtual do PC-analyzer. Estou aqui para te ajudar a escolher a melhor configuração de PC para os seus jogos favoritos. (Integração pendente da GEMINI_API_KEY no arquivo .env)",
    recommendedComponents: []
  };
}

/**
 * Gera um prompt customizado para sugerir um PC baseado em orçamento e jogos alvo
 */
export function generateSystemPrompt(
  budget: number,
  games: string[],
  resolution: string
): string {
  return `Você é um especialista em hardware de computadores.
Sugira a melhor configuração de PC para rodar os seguintes jogos: ${games.join(", ")} na resolução ${resolution}.
O orçamento disponível é de R$ ${budget.toFixed(2)}.
Certifique-se de escolher peças compatíveis e equilibradas (sem gargalos severos de CPU/GPU).`;
}
