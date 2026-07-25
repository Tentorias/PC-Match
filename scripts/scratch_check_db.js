const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const comp = await prisma.componente.findMany({
    where: { categoria: { in: ['FONTE', 'COOLER'] } }
  });
  console.dir(comp, { depth: null });
}

main().finally(() => prisma.$disconnect());
