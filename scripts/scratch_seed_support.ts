import { prisma } from './src/lib/db';

const componentesExtra = [
  // FONTES
  { nome: "Corsair RM850x", categoria: "FONTE", marca: "Corsair", modelo: "RM850x", preco: 850, tdp: 0, potencia: 850, estoque: 20, especificacoes: { certificado: "80 Plus Gold" } },
  { nome: "XPG Core Reactor 1000W", categoria: "FONTE", marca: "XPG", modelo: "Core Reactor", preco: 1100, tdp: 0, potencia: 1000, estoque: 15, especificacoes: { certificado: "80 Plus Gold" } },
  { nome: "Super Flower Leadex 1200W", categoria: "FONTE", marca: "Super Flower", modelo: "Leadex", preco: 1500, tdp: 0, potencia: 1200, estoque: 10, especificacoes: { certificado: "80 Plus Platinum" } },
  
  // COOLERS
  { nome: "Water Cooler NZXT Kraken 240mm", categoria: "COOLER", marca: "NZXT", modelo: "Kraken 240", preco: 900, tdp: 200, estoque: 15, especificacoes: { tipo: "Water Cooler" } },
  { nome: "Water Cooler Corsair H150i 360mm", categoria: "COOLER", marca: "Corsair", modelo: "H150i", preco: 1300, tdp: 250, estoque: 10, especificacoes: { tipo: "Water Cooler" } },
  { nome: "Noctua NH-D15", categoria: "COOLER", marca: "Noctua", modelo: "NH-D15", preco: 800, tdp: 220, estoque: 12, especificacoes: { tipo: "Air Cooler" } },
  
  // PROCESSADORES (Alta Performance para acompanhar as GPUs)
  { nome: "Intel Core i9-14900K", categoria: "CPU", marca: "Intel", modelo: "14900K", preco: 3800, tdp: 253, socket: "LGA1700", clock: 6.0, estoque: 15, especificacoes: { cores: 24 } },
  { nome: "AMD Ryzen 9 7950X3D", categoria: "CPU", marca: "AMD", modelo: "7950X3D", preco: 4200, tdp: 120, socket: "AM5", clock: 5.7, estoque: 10, especificacoes: { cores: 16 } },
  { nome: "AMD Ryzen 7 7800X3D", categoria: "CPU", marca: "AMD", modelo: "7800X3D", preco: 2800, tdp: 120, socket: "AM5", clock: 5.0, estoque: 25, especificacoes: { cores: 8 } },

  // PLACAS MÃE
  { nome: "ASUS ROG Strix Z790-E", categoria: "PLACA_MAE", marca: "ASUS", modelo: "Z790-E", preco: 2500, tdp: 30, socket: "LGA1700", tipoRam: "DDR5", estoque: 15, especificacoes: { formFactor: "ATX" } },
  { nome: "Gigabyte X670E AORUS Master", categoria: "PLACA_MAE", marca: "Gigabyte", modelo: "X670E", preco: 2800, tdp: 35, socket: "AM5", tipoRam: "DDR5", estoque: 15, especificacoes: { formFactor: "ATX" } },

  // RAM
  { nome: "Kingston Fury Beast 32GB (2x16GB) DDR5", categoria: "RAM", marca: "Kingston", modelo: "Fury Beast", preco: 900, tdp: 10, tipoRam: "DDR5", clock: 6000, capacidade: "32GB", estoque: 30, especificacoes: {} },
  { nome: "Corsair Dominator Titanium 64GB (2x32) DDR5", categoria: "RAM", marca: "Corsair", modelo: "Dominator", preco: 2200, tdp: 15, tipoRam: "DDR5", clock: 6400, capacidade: "64GB", estoque: 10, especificacoes: {} },

  // ARMAZENAMENTO (High-end)
  { nome: "SSD Samsung 990 PRO 2TB NVMe", categoria: "ARMAZENAMENTO", marca: "Samsung", modelo: "990 PRO", preco: 1400, tdp: 5, capacidade: "2TB", estoque: 20, especificacoes: { leitura: 7450 } },
  { nome: "SSD WD Black SN850X 4TB NVMe", categoria: "ARMAZENAMENTO", marca: "WD", modelo: "SN850X", preco: 2800, tdp: 8, capacidade: "4TB", estoque: 10, especificacoes: { leitura: 7300 } },

  // GABINETES (Premium)
  { nome: "Lian Li O11 Dynamic EVO", categoria: "GABINETE", marca: "Lian Li", modelo: "O11D", preco: 1100, tdp: 0, estoque: 20, especificacoes: { formato: "Mid Tower" } }
];

async function main() {
  console.log('Injetando componentes de suporte High-End...');
  for (const comp of componentesExtra) {
    try {
      await prisma.componente.create({ data: comp as any });
      console.log(`+ ${comp.nome}`);
    } catch(e) {
      console.log(`- Erro em ${comp.nome}`);
    }
  }
}

main().finally(() => prisma.$disconnect());
