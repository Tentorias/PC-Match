"use server";

import { prisma } from "@/lib/db";
import { otimizarSetup } from "@/lib/otimizador";

interface OtimizarParametros {
  orcamentoMax: number;
  focoGpu?: boolean;
  focoCpu?: boolean;
  jogoNome?: string;
  resolucaoAlvo?: string;
}

export async function obterJogosDisponiveis() {
  try {
    return await prisma.jogo.findMany({
      orderBy: { nome: "asc" },
    });
  } catch (error) {
    console.error("Erro ao carregar jogos:", error);
    return [];
  }
}

export async function processarRecomendacao(params: OtimizarParametros) {
  try {
    // 1. Buscar todas as peças em estoque
    const componentes = await prisma.componente.findMany({
      where: {
        estoque: {
          gt: 0,
        },
      },
    });

    // 2. Executar o otimizador (Knapsack)
    const resultado = otimizarSetup(componentes, params.orcamentoMax, {
      focoGpu: params.focoGpu,
      focoCpu: params.focoCpu,
    });

    // 3. Registrar a busca no banco de dados para estatísticas do lojista
    await prisma.logBusca.create({
      data: {
        orcamento: params.orcamentoMax,
        jogoNome: params.jogoNome || "Montagem Livre",
        resolucaoAlvo: params.resolucaoAlvo || "1080p",
        sucesso: resultado !== null,
        componentesIds: resultado
          ? resultado.componentes.map((c) => c.id)
          : [],
      },
    });

    return {
      sucesso: resultado !== null,
      dados: resultado,
      mensagem: resultado ? "Configuração otimizada com sucesso!" : "Não encontramos uma combinação compatível dentro do orçamento informado.",
    };
  } catch (error) {
    console.error("Erro ao processar recomendação:", error);
    return {
      sucesso: false,
      dados: null,
      mensagem: "Ocorreu um erro interno ao processar a recomendação.",
    };
  }
}
