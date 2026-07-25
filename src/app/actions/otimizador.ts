"use server";

import { prisma } from "@/lib/db";
import { otimizarSetup } from "@/lib/otimizador";

interface OtimizarParametros {
  orcamentoMax: number;
  focoGpu?: boolean;
  focoCpu?: boolean;
  jogoNome?: string;
  resolucaoAlvo?: string;
  qualidadeGrafica?: string;
  fpsAlvo?: string;
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
    const componentes = await prisma.componente.findMany({
      where: { estoque: { gt: 0 } },
    });

    let finalFocoCpu = params.focoCpu;
    let finalFocoGpu = params.focoGpu;

    if (params.fpsAlvo === "144" || params.fpsAlvo === "240") finalFocoCpu = true;
    if (params.qualidadeGrafica === "Ultra" || params.resolucaoAlvo === "4K") finalFocoGpu = true;

    const baseBudget = params.orcamentoMax;
    const economico = Math.max(2500, baseBudget * 0.45);
    const custoBeneficio = Math.max(4000, baseBudget * 0.70);
    const budgetsToTry = [
      { id: "economico", nome: "Econômico", valor: economico },
      { id: "custo-beneficio", nome: "Custo-Benefício", valor: custoBeneficio },
      { id: "maximo", nome: "Máximo", valor: baseBudget },
    ];

    const resultadosBrutos: Array<{ id: string; nome: string; setup: any }> = [];

    for (const b of budgetsToTry) {
      if (b.valor > baseBudget) continue; 
      
      const res = otimizarSetup(componentes, b.valor, {
        focoGpu: finalFocoGpu,
        focoCpu: finalFocoCpu,
      });

      if (res) {
        resultadosBrutos.push({ id: b.id, nome: b.nome, setup: res });
      }
    }

    const opcoesFinais = [];
    const setupsVistos = new Set<number>(); 
    
    for (const r of resultadosBrutos) {
      if (!setupsVistos.has(r.setup.precoTotal)) {
        setupsVistos.add(r.setup.precoTotal);
        opcoesFinais.push(r);
      }
    }

    const melhorOpcao = opcoesFinais[opcoesFinais.length - 1]; 
    await prisma.logBusca.create({
      data: {
        orcamento: params.orcamentoMax,
        jogoNome: params.jogoNome || "Montagem Livre",
        resolucaoAlvo: params.resolucaoAlvo || "1080p",
        qualidadeGrafica: params.qualidadeGrafica || "Medium",
        fpsAlvo: params.fpsAlvo || "60",
        sucesso: opcoesFinais.length > 0,
        componentesIds: melhorOpcao ? melhorOpcao.setup.componentes.map((c: any) => c.id) : [],
      },
    });

    return {
      sucesso: opcoesFinais.length > 0,
      dados: opcoesFinais,
      mensagem: opcoesFinais.length > 0 
        ? "Configurações otimizadas com sucesso!" 
        : "Não encontramos combinações compatíveis dentro do orçamento informado.",
    };
  } catch (error: any) {
    console.error("Erro ao processar recomendação:", error);
    
    const errorMessage = error?.message || "Erro desconhecido";
    const userMessage = process.env.NODE_ENV === 'development' 
      ? `Ocorreu um erro interno ao processar a recomendação. [DEV INFO: ${errorMessage}]`
      : "Ocorreu um erro interno ao processar a recomendação.";

    return {
      sucesso: false,
      dados: null,
      mensagem: userMessage,
    };
  }
}
