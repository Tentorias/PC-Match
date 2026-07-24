"use server";

import { prisma } from "@/lib/db";

export async function getDashboardStats() {
  const totalBuscas = await prisma.logBusca.count();
  
  const buscasComOrcamento = await prisma.logBusca.findMany({
    where: { orcamento: { not: null } },
    select: { orcamento: true }
  });
  
  const orcamentoMedio = buscasComOrcamento.length > 0
    ? buscasComOrcamento.reduce((acc, curr) => acc + (curr.orcamento || 0), 0) / buscasComOrcamento.length
    : 0;
    
  const taxaSucesso = await prisma.logBusca.count({ where: { sucesso: true } });
  
  const jogosCounts = await prisma.logBusca.groupBy({
    by: ['jogoNome'],
    _count: {
      jogoNome: true,
    },
    where: { jogoNome: { not: null } },
    orderBy: {
      _count: {
        jogoNome: 'desc',
      },
    },
    take: 3,
  });

  return {
    totalBuscas,
    orcamentoMedio,
    taxaSucesso: totalBuscas > 0 ? (taxaSucesso / totalBuscas) * 100 : 0,
    topJogos: jogosCounts.map(j => ({ nome: j.jogoNome, contagem: j._count.jogoNome }))
  };
}
