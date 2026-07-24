import { Componente, CategoriaComponente } from "@prisma/client";

export interface ResultadoCompatibilidade {
  compativel: boolean;
  erros: string[];
  avisos: string[];
  consumoEstimadoW: number;
  potenciaRecomendadaW: number;
}

/**
 * Verifica a compatibilidade entre uma lista de componentes de hardware
 */
export function verificarCompatibilidade(componentes: Componente[]): ResultadoCompatibilidade {
  const erros: string[] = [];
  const avisos: string[] = [];

  const cpu = componentes.find((c) => c.categoria === CategoriaComponente.CPU);
  const placaMae = componentes.find((c) => c.categoria === CategoriaComponente.PLACA_MAE);
  const memorias = componentes.filter((c) => c.categoria === CategoriaComponente.RAM);
  const gpu = componentes.find((c) => c.categoria === CategoriaComponente.GPU);
  const fonte = componentes.find((c) => c.categoria === CategoriaComponente.FONTE);
  const cooler = componentes.find((c) => c.categoria === CategoriaComponente.COOLER && (c.tdp || 0) > 0);

  // 1. Socket CPU vs Placa-Mãe
  if (cpu && placaMae) {
    if (cpu.socket && placaMae.socket && cpu.socket.trim().toLowerCase() !== placaMae.socket.trim().toLowerCase()) {
      erros.push(
        `Socket incompatível: O processador (${cpu.marca} ${cpu.modelo}) usa socket ${cpu.socket}, mas a placa-mãe (${placaMae.nome}) possui socket ${placaMae.socket}.`
      );
    }
  }

  // 2. Tipo de RAM vs Placa-Mãe
  if (placaMae && memorias.length > 0) {
    for (const ram of memorias) {
      if (placaMae.tipoRam && ram.tipoRam && placaMae.tipoRam.trim().toLowerCase() !== ram.tipoRam.trim().toLowerCase()) {
        erros.push(
          `Tipo de memória incompatível: A placa-mãe suporta memórias do tipo ${placaMae.tipoRam}, mas o módulo selecionado (${ram.nome}) é ${ram.tipoRam}.`
        );
      }
    }
  }

  // 3. Consumo Energético e Fonte (TDP)
  let consumoEstimadoW = 50; // Consumo base para placa-mãe, ventoinhas e periféricos
  componentes.forEach((c) => {
    consumoEstimadoW += c.tdp || 0;
  });

  const potenciaRecomendadaW = Math.ceil((consumoEstimadoW * 1.25) / 50) * 50; // 25% de margem, arredondado para cima múltiplo de 50W

  if (fonte) {
    const potenciaFonte = fonte.potencia || 0;
    if (potenciaFonte > 0) {
      if (consumoEstimadoW > potenciaFonte) {
        erros.push(
          `Energia insuficiente: O consumo estimado do sistema é de ~${consumoEstimadoW}W, superando os ${potenciaFonte}W fornecidos pela fonte (${fonte.nome}).`
        );
      } else if (potenciaFonte < potenciaRecomendadaW) {
        // Agora isso é um erro rígido
        erros.push(
          `Margem de segurança da fonte insuficiente: A fonte de ${potenciaFonte}W não suporta a máquina de ~${consumoEstimadoW}W com 25% de margem. Requer no mínimo ${potenciaRecomendadaW}W.`
        );
      }
    }
  }

  // 3.5 TDP Cooler vs CPU
  if (cpu && cooler) {
    const coolerTdp = cooler.tdp || 0;
    const cpuTdp = cpu.tdp || 0;
    if (coolerTdp > 0 && cpuTdp > 0 && coolerTdp < cpuTdp) {
      erros.push(
        `Risco Térmico: O Cooler selecionado (${cooler.nome}) suporta apenas dissipar ${coolerTdp}W, mas o processador (${cpu.nome}) atinge ${cpuTdp}W. O processador irá superaquecer.`
      );
    }
  }

  // 4. Avisos gerais de ausência de peças chave
  if (!cpu && (placaMae || memorias.length > 0)) {
    avisos.push("Processador ausente: Para avaliar a máquina completa, selecione um processador.");
  }
  if (!placaMae && cpu) {
    avisos.push("Placa-mãe ausente: Selecione uma placa-mãe compatível com o processador.");
  }

  return {
    compativel: erros.length === 0,
    erros,
    avisos,
    consumoEstimadoW,
    potenciaRecomendadaW,
  };
}
