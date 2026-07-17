import { Componente, CategoriaComponente } from "@prisma/client";
import { verificarCompatibilidade } from "./compatibilidade";

export interface SetupOtimizado {
  componentes: Componente[];
  precoTotal: number;
  desempenhoPontos: number;
  gargalo: string;
  fpsEstimadoGeral: number;
}

/**
 * Algoritmo de Otimização Knapsack Adaptado (Multiple-Choice Knapsack Problem)
 * Tenta selecionar exatamente 1 CPU, 1 GPU, 1 Placa-Mãe, 1 RAM e 1 Fonte que caibam no orçamento
 * e entreguem a melhor pontuação de desempenho teórico para os jogos.
 */
export function otimizarSetup(
  todosComponentes: Componente[],
  orcamentoMax: number,
  preferencias?: {
    focoGpu?: boolean; // Se verdadeiro, dá mais peso para placa de vídeo (jogos pesados graficamente)
    focoCpu?: boolean; // Se verdadeiro, dá mais peso para processador (jogos competitivos leves)
  }
): SetupOtimizado | null {
  const cpus = todosComponentes.filter((c) => c.categoria === CategoriaComponente.CPU);
  const gpus = todosComponentes.filter((c) => c.categoria === CategoriaComponente.GPU);
  const placaMaes = todosComponentes.filter((c) => c.categoria === CategoriaComponente.PLACA_MAE);
  const memorias = todosComponentes.filter((c) => c.categoria === CategoriaComponente.RAM);
  const fontes = todosComponentes.filter((c) => c.categoria === CategoriaComponente.FONTE);

  if (cpus.length === 0 || gpus.length === 0 || placaMaes.length === 0 || memorias.length === 0 || fontes.length === 0) {
    return null;
  }

  let melhorCombinacao: Componente[] = [];
  let maiorDesempenho = 0;
  let menorCusto = 0;

  // Ajusta pesos de desempenho teórico
  let pesoCpu = 0.4;
  let pesoGpu = 0.6;

  if (preferencias?.focoGpu) {
    pesoCpu = 0.25;
    pesoGpu = 0.75;
  } else if (preferencias?.focoCpu) {
    pesoCpu = 0.6;
    pesoGpu = 0.4;
  }

  // Busca exaustiva com podas rápidas por preço e compatibilidade
  for (const cpu of cpus) {
    if (cpu.preco > orcamentoMax) continue;

    for (const placaMae of placaMaes) {
      if (cpu.preco + placaMae.preco > orcamentoMax) continue;
      // Poda por socket
      if (cpu.socket && placaMae.socket && cpu.socket.trim().toLowerCase() !== placaMae.socket.trim().toLowerCase()) continue;

      for (const ram of memorias) {
        const custoParcial1 = cpu.preco + placaMae.preco + ram.preco;
        if (custoParcial1 > orcamentoMax) continue;
        // Poda por tipo de RAM
        if (placaMae.tipoRam && ram.tipoRam && placaMae.tipoRam.trim().toLowerCase() !== ram.tipoRam.trim().toLowerCase()) continue;

        for (const gpu of gpus) {
          const custoParcial2 = custoParcial1 + gpu.preco;
          if (custoParcial2 > orcamentoMax) continue;

          for (const fonte of fontes) {
            const custoTotal = custoParcial2 + fonte.preco;
            if (custoTotal > orcamentoMax) continue;

            const setup = [cpu, placaMae, ram, gpu, fonte];
            const compCheck = verificarCompatibilidade(setup);

            // Apenas combinações perfeitamente compatíveis
            if (!compCheck.compativel) continue;

            // Cálculo do score de desempenho teórico (baseado no custo relativo e clock/especificações)
            const scoreCpu = (cpu.clock || 3.0) * (cpu.preco / 100);
            const scoreGpu = (gpu.clock || 1.5) * (gpu.preco / 100);
            const desempenhoTeorico = scoreCpu * pesoCpu + scoreGpu * pesoGpu;

            if (desempenhoTeorico > maiorDesempenho) {
              maiorDesempenho = desempenhoTeorico;
              melhorCombinacao = setup;
              menorCusto = custoTotal;
            }
          }
        }
      }
    }
  }

  if (melhorCombinacao.length === 0) {
    return null;
  }

  // Identificação de gargalo
  const cpuEscolhida = melhorCombinacao.find((c) => c.categoria === CategoriaComponente.CPU)!;
  const gpuEscolhida = melhorCombinacao.find((c) => c.categoria === CategoriaComponente.GPU)!;
  let gargalo = "Equilibrado";

  if (cpuEscolhida.preco < gpuEscolhida.preco * 0.25) {
    gargalo = "Processador Fraco (Pode limitar o desempenho da Placa de Vídeo)";
  } else if (gpuEscolhida.preco < cpuEscolhida.preco * 0.4) {
    gargalo = "Placa de Vídeo Limitante (O processador suporta placas muito mais rápidas)";
  }

  return {
    componentes: melhorCombinacao,
    precoTotal: menorCusto,
    desempenhoPontos: Math.round(maiorDesempenho),
    gargalo,
    fpsEstimadoGeral: Math.round(maiorDesempenho * 1.5),
  };
}
