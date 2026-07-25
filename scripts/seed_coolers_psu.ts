import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:milho007@localhost:5432/pc_analyzer?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Atualizando TDPs (TDP Max Suportado) dos Coolers existentes...");
  
  // Mapeamento manual dos TDPs baseados nos modelos
  const tdpMap: Record<string, number> = {
    'Box': 65, 
    'Z3': 65,
    'ICE 400 SE': 100,
    '4 Heatpipes': 120,
    'Gammaxx 400 V2': 130,
    'Hyper 212': 150,
    'Fuma 2': 200,
    'NH-D15': 220,
    '240mm RGB': 250,
    'H150i Elite': 350
  };

  const coolers = await prisma.componente.findMany({ where: { categoria: 'COOLER' } });
  
  for (const cooler of coolers) {
    let tdpMax = 0; // Para Fans de gabinete, o tdp continua 0 (não conta como dissipador de CPU)
    for (const [key, tdpValue] of Object.entries(tdpMap)) {
      if (cooler.modelo.includes(key)) {
        tdpMax = tdpValue;
        break;
      }
    }
    
    await prisma.componente.update({
      where: { id: cooler.id },
      data: { tdp: tdpMax }
    });
    console.log(`- Atualizado Cooler [${cooler.nome}]: TDP Suportado -> ${tdpMax}W`);
  }

  console.log("\nInserindo novas fontes potentes...");
  const fontesToInsert = [
    { nome: 'Fonte Corsair CV650 650W 80 Plus Bronze', categoria: 'FONTE', marca: 'Corsair', modelo: 'CV650', preco: 380.00, estoque: 7, potencia: 650, tdp: 0, especificacoes: {} },
    { nome: 'Fonte XPG Core Reactor 750W 80 Plus Gold', categoria: 'FONTE', marca: 'XPG', modelo: 'Core Reactor 750W', preco: 650.00, estoque: 7, potencia: 750, tdp: 0, especificacoes: {} },
    { nome: 'Fonte XPG Core Reactor 850W 80 Plus Gold', categoria: 'FONTE', marca: 'XPG', modelo: 'Core Reactor 850W', preco: 750.00, estoque: 7, potencia: 850, tdp: 0, especificacoes: {} },
    { nome: 'Fonte Corsair RM1000x 1000W 80 Plus Gold', categoria: 'FONTE', marca: 'Corsair', modelo: 'RM1000x', preco: 1200.00, estoque: 7, potencia: 1000, tdp: 0, especificacoes: {} },
  ];

  for (const fonte of fontesToInsert) {
    try {
      await prisma.componente.create({
        data: fonte as any,
      });
      console.log(`✅ Fonte inserida: ${fonte.nome}`);
    } catch (e) {
      console.error(`❌ Erro ao inserir fonte ${fonte.nome}:`, e);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
