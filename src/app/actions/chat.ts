"use server";

import { getJsonFromGemini } from "@/lib/gemini";
import { processarRecomendacao } from "./otimizador";

const CHAT_INTENT_SCHEMA = `{
  "intent": "chat | build",
  "response": "string (Se intent for chat, uma resposta amigável e natural. Se for build, deixe null.)",
  "orcamentoMax": "number (Se intent for build, qual o orçamento? null se não souber ainda)",
  "jogos": "array of strings (Se intent for build, quais jogos ele mencionou? null se não souber)",
  "foco": "gpu | cpu | balanceado (Se intent for build, baseado no que ele disse. Padrão: balanceado)"
}`;

export async function processarMensagemChat(mensagem: string, historicoTexto: string) {
  const prompt = `Você é o assistente virtual de uma loja de PCs Gamers ("PC Nexus").
Sua função é conversar com o cliente e ajudá-lo a montar um PC.
Se ele estiver apenas conversando ou tirando dúvidas rápidas, responda amigavelmente (intent: "chat").
Se ele expressar o desejo de montar um PC e der informações suficientes (especialmente Orçamento e alguns Jogos), classifique como intent: "build" e extraia os dados.
Se ele quiser montar, mas faltar o orçamento ou jogos, responda (intent: "chat") perguntando educadamente sobre o que falta.

Histórico recente da conversa:
${historicoTexto}

Mensagem atual do usuário: "${mensagem}"`;

  try {
    const data = await getJsonFromGemini(prompt, CHAT_INTENT_SCHEMA);
    
    if (data.intent === "chat") {
      return { 
        type: "chat", 
        message: data.response || "Desculpe, não entendi bem. Poderia repetir?" 
      };
    }
    
    if (data.intent === "build") {
      if (!data.orcamentoMax || !data.jogos || data.jogos.length === 0) {
        return {
          type: "chat",
          message: "Perfeito! Para eu montar a melhor configuração para você, qual seria o seu orçamento máximo e quais jogos principais você quer rodar?"
        };
      }

      // Se temos os dados, roda o otimizador
      const buildResult = await processarRecomendacao({
        orcamentoMax: data.orcamentoMax,
        jogoNome: data.jogos.join(" + "),
        resolucaoAlvo: "1080p", // Padrão
        focoGpu: data.foco === "gpu" || data.foco === "balanceado",
        focoCpu: data.foco === "cpu" || data.foco === "balanceado"
      });

      if (!buildResult.sucesso || !buildResult.dados) {
        return {
          type: "chat",
          message: `Infelizmente, não consegui montar um PC completo com o orçamento de R$ ${data.orcamentoMax}. Os componentes básicos (Placa-mãe, Processador, Memória, Placa de Vídeo e Fonte) no nosso estoque atualmente ultrapassam esse valor. Você teria como aumentar um pouco o orçamento?`
        };
      }

      return {
        type: "build",
        message: "Excelente! Analisei seu pedido e montei a máquina perfeita para o seu perfil. Dá uma olhada:",
        buildParams: {
          orcamentoMax: data.orcamentoMax,
          jogos: data.jogos,
          foco: data.foco
        },
        buildResult
      };
    }

    return { type: "chat", message: "Houve um pequeno erro ao processar sua intenção." };

  } catch (error: any) {
    console.error("Erro no NLP Chat:", error);
    return { type: "chat", message: `Erro de IA: ${error.message || error}` };
  }
}
