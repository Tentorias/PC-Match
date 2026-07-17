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
      } else if (consumoEstimadoW > potenciaFonte * 0.85) {
        avisos.push(
          `Margem de segurança baixa: A fonte de ${potenciaFonte}W vai operar próxima ao limite sob carga máxima (~${consumoEstimadoW}W). Recomenda-se pelo menos ${potenciaRecomendadaW}W.`
        );
      }
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
