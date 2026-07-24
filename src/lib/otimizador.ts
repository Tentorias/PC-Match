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
    focoGpu?: boolean;
    focoCpu?: boolean;
  }
): SetupOtimizado | null {
  const cpus = todosComponentes.filter((c) => c.categoria === CategoriaComponente.CPU);
  const gpus = todosComponentes.filter((c) => c.categoria === CategoriaComponente.GPU);
  const placaMaes = todosComponentes.filter((c) => c.categoria === CategoriaComponente.PLACA_MAE);
  const memorias = todosComponentes.filter((c) => c.categoria === CategoriaComponente.RAM);
  const fontes = todosComponentes.filter((c) => c.categoria === CategoriaComponente.FONTE).sort((a, b) => a.preco - b.preco);
  const coolers = todosComponentes.filter((c) => c.categoria === CategoriaComponente.COOLER && (c.tdp || 0) > 0).sort((a, b) => a.preco - b.preco);
  const armazenamentos = todosComponentes.filter((c) => c.categoria === CategoriaComponente.ARMAZENAMENTO).sort((a, b) => a.preco - b.preco);
  const gabinetes = todosComponentes.filter((c) => c.categoria === CategoriaComponente.GABINETE).sort((a, b) => a.preco - b.preco);

  if (cpus.length === 0 || gpus.length === 0 || placaMaes.length === 0 || memorias.length === 0 || fontes.length === 0 || armazenamentos.length === 0 || gabinetes.length === 0) {
    return null; // Impossível montar PC sem o mínimo de peças no estoque
  }

  let melhorCombinacao: Componente[] = [];
  let maiorDesempenho = 0;
  let menorCusto = 0;

  let pesoCpu = 0.4;
  let pesoGpu = 0.6;
  if (preferencias?.focoGpu) {
    pesoCpu = 0.25;
    pesoGpu = 0.75;
  } else if (preferencias?.focoCpu) {
    pesoCpu = 0.6;
    pesoGpu = 0.4;
  }

  const discoMaisBarato = armazenamentos[0];
  const gabineteMaisBarato = gabinetes[0];

  for (const cpu of cpus) {
    for (const placaMae of placaMaes) {
      if (cpu.socket && placaMae.socket && cpu.socket.trim().toLowerCase() !== placaMae.socket.trim().toLowerCase()) continue;

      for (const ram of memorias) {
        if (placaMae.tipoRam && ram.tipoRam && placaMae.tipoRam.trim().toLowerCase() !== ram.tipoRam.trim().toLowerCase()) continue;

        for (const gpu of gpus) {
          // 1. Achar o cooler compatível mais barato
          const coolerIdeal = coolers.find(c => (c.tdp || 0) >= (cpu.tdp || 0));
          if (!coolerIdeal) continue; // Sem cooler que suporte essa CPU no estoque

          // 2. Calcular consumo de energia
          const consumoEstimado = (cpu.tdp || 0) + (gpu.tdp || 0) + 50; 
          const potenciaMinima = consumoEstimado * 1.25;

          // 3. Achar a fonte compatível mais barata
          const fonteIdeal = fontes.find(f => (f.potencia || 0) >= potenciaMinima);
          if (!fonteIdeal) continue; // Sem fonte potente o suficiente no estoque

          // 4. Somar custo total da build completa
          const custoTotal = cpu.preco + placaMae.preco + ram.preco + gpu.preco + coolerIdeal.preco + fonteIdeal.preco + discoMaisBarato.preco + gabineteMaisBarato.preco;

          if (custoTotal > orcamentoMax) continue;

          // 5. Verificar compatibilidade estrita
          const setup = [cpu, placaMae, ram, gpu, fonteIdeal, coolerIdeal, discoMaisBarato, gabineteMaisBarato];
          const compCheck = verificarCompatibilidade(setup);
          if (!compCheck.compativel) continue;

          // 6. Calcular Score
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

  if (melhorCombinacao.length === 0) return null;

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
