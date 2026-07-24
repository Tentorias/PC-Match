import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:milho007@localhost:5432/pc_analyzer?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const componentsToInsert = [
    // CPU COOLERS BARATOS E CAROS
    { nome: 'Rise Mode Z3', categoria: 'COOLER', marca: 'Rise Mode', modelo: 'Z3', preco: 30.00, estoque: 7 },
    { nome: 'DeepCool Gammaxx 400 V2', categoria: 'COOLER', marca: 'DeepCool', modelo: 'Gammaxx 400 V2', preco: 90.00, estoque: 7 },
    { nome: 'Cooler Master Hyper 212', categoria: 'COOLER', marca: 'Cooler Master', modelo: 'Hyper 212', preco: 150.00, estoque: 7 },
    { nome: 'Scythe Fuma 2', categoria: 'COOLER', marca: 'Scythe', modelo: 'Fuma 2', preco: 350.00, estoque: 7 },
    { nome: 'Noctua NH-D15', categoria: 'COOLER', marca: 'Noctua', modelo: 'NH-D15', preco: 750.00, estoque: 7 },
    { nome: 'Water Cooler Rise Mode 240mm', categoria: 'COOLER', marca: 'Rise Mode', modelo: '240mm RGB', preco: 220.00, estoque: 7 },
    { nome: 'Water Cooler Corsair H150i Elite 360mm', categoria: 'COOLER', marca: 'Corsair', modelo: 'H150i Elite', preco: 1100.00, estoque: 7 },

    // FANS DE GABINETE (DIVERSOS PREÇOS)
    { nome: 'Fan Rise Mode 120mm Preto (Sem LED)', categoria: 'COOLER', marca: 'Rise Mode', modelo: '120mm Black', preco: 15.00, estoque: 7 },
    { nome: 'Kit 3x Fans Aigo ARGB 120mm', categoria: 'COOLER', marca: 'Aigo', modelo: '3x 120mm ARGB', preco: 70.00, estoque: 7 },
    { nome: 'Fan Cooler Master SickleFlow 120', categoria: 'COOLER', marca: 'Cooler Master', modelo: 'SickleFlow 120', preco: 45.00, estoque: 7 },
    { nome: 'Fan Corsair LL120 RGB 120mm', categoria: 'COOLER', marca: 'Corsair', modelo: 'LL120 RGB', preco: 180.00, estoque: 7 },
    { nome: 'Fan Noctua NF-A12x25 120mm', categoria: 'COOLER', marca: 'Noctua', modelo: 'NF-A12x25', preco: 220.00, estoque: 7 },
    { nome: 'Kit 3x Fans Lian Li UNI FAN SL120', categoria: 'COOLER', marca: 'Lian Li', modelo: 'UNI FAN SL120', preco: 600.00, estoque: 7 },
  ];

  for (const component of componentsToInsert) {
    try {
      const dataToSave = {
        ...component,
        tdp: (component as any).tdp || 0,
        especificacoes: (component as any).especificacoes || {},
      };
      await prisma.componente.create({
        data: dataToSave as any,
      });
      console.log(`✅ Inserido: ${component.nome}`);
    } catch (e) {
      console.error(`❌ Erro ao inserir ${component.nome}:`, e);
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
