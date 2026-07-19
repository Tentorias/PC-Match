import { CategoriaComponente, Componente, Jogo } from "@prisma/client";
export type { Componente, Jogo };

export type CategoriaKey = keyof typeof CategoriaComponente;

export interface SetupPC {
  cpu?: Componente;
  gpu?: Componente;
  placaMae?: Componente;
  ram?: Componente;
  fonte?: Componente;
  armazenamento?: Componente;
  cooler?: Componente;
  gabinete?: Componente;
}

export interface RecomendacaoFiltro {
  orcamento: number;
  jogosSelecionados: Jogo[];
  resolucao: "1080p" | "1440p" | "4K";
  qualidadeAlvo: "low" | "medium" | "high" | "ultra";
}

export interface MensagemChat {
  id: string;
  remetente: "usuario" | "assistente";
  conteudo: string;
  data: Date;
  sugestoesHardware?: Componente[];
}
