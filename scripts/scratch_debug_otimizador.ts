import { prisma } from './src/lib/db';
import { otimizarSetup } from './src/lib/otimizador';

async function main() {
  const componentes = await prisma.componente.findMany({
    where: { estoque: { gt: 0 } },
  });

  // O usuário disse que com 20.000 ele pegou i5-12400F e GTX 1060.
  // Vamos rodar o algoritmo e debugar os scores.
  
  const orcamento = 20000;
  const preferencias = { focoGpu: true, focoCpu: false };

  const result = otimizarSetup(componentes, orcamento, preferencias);

  console.dir(result, { depth: null });
}

main().finally(() => prisma.$disconnect());
