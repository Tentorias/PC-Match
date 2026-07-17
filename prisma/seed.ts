import { PrismaClient, CategoriaComponente } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando o semeio do banco de dados (seeding)...");

  // Limpar tabelas existentes para evitar duplicações
  await prisma.logBusca.deleteMany();
  await prisma.componente.deleteMany();
  await prisma.jogo.deleteMany();

  // Inserir Componentes
  const componentes = [
    // CPUs
    {
      nome: "AMD Ryzen 5 5600",
      categoria: CategoriaComponente.CPU,
      marca: "AMD",
      modelo: "Ryzen 5 5600",
      preco: 849.90,
      tdp: 65,
      socket: "AM4",
      clock: 3.5,
      especificacoes: { cores: 6, threads: 12, clockBoost: 4.4, cache: "32MB" },
      estoque: 15,
      vendas: 120,
    },
    {
      nome: "AMD Ryzen 7 5700X",
      categoria: CategoriaComponente.CPU,
      marca: "AMD",
      modelo: "Ryzen 7 5700X",
      preco: 1299.00,
      tdp: 65,
      socket: "AM4",
      clock: 3.4,
      especificacoes: { cores: 8, threads: 16, clockBoost: 4.6, cache: "32MB" },
      estoque: 10,
      vendas: 85,
    },
    {
      nome: "Intel Core i5-12400F",
      categoria: CategoriaComponente.CPU,
      marca: "Intel",
      modelo: "Core i5-12400F",
      preco: 799.00,
      tdp: 65,
      socket: "LGA1700",
      clock: 2.5,
      especificacoes: { cores: 6, threads: 12, clockBoost: 4.4, cache: "18MB" },
      estoque: 20,
      vendas: 95,
    },
    // GPUs
    {
      nome: "Nvidia GeForce RTX 3060 12GB",
      categoria: CategoriaComponente.GPU,
      marca: "Nvidia",
      modelo: "RTX 3060",
      preco: 1899.90,
      tdp: 170,
      capacidade: "12GB VRAM",
      clock: 1.32,
      especificacoes: { vramType: "GDDR6", busWidth: "192-bit", cudaCores: 3584 },
      estoque: 8,
      vendas: 140,
    },
    {
      nome: "Nvidia GeForce RTX 4060 Ti 8GB",
      categoria: CategoriaComponente.GPU,
      marca: "Nvidia",
      modelo: "RTX 4060 Ti",
      preco: 2499.00,
      tdp: 160,
      capacidade: "8GB VRAM",
      clock: 2.31,
      especificacoes: { vramType: "GDDR6", busWidth: "128-bit", cudaCores: 4352 },
      estoque: 5,
      vendas: 64,
    },
    {
      nome: "AMD Radeon RX 6600 8GB",
      categoria: CategoriaComponente.GPU,
      marca: "AMD",
      modelo: "RX 6600",
      preco: 1399.00,
      tdp: 132,
      capacidade: "8GB VRAM",
      clock: 1.62,
      especificacoes: { vramType: "GDDR6", busWidth: "128-bit", streamProcessors: 1792 },
      estoque: 12,
      vendas: 110,
    },
    // RAM
    {
      nome: "Kingston Fury Beast 8GB DDR4 3200MHz",
      categoria: CategoriaComponente.RAM,
      marca: "Kingston",
      modelo: "Fury Beast",
      preco: 179.90,
      tdp: 5,
      tipoRam: "DDR4",
      clock: 3200,
      capacidade: "8GB",
      especificacoes: { latencia: "CL16", tensao: "1.35V" },
      estoque: 40,
      vendas: 320,
    },
    {
      nome: "Corsair Vengeance LPX 16GB DDR4 3200MHz",
      categoria: CategoriaComponente.RAM,
      marca: "Corsair",
      modelo: "Vengeance LPX",
      preco: 329.00,
      tdp: 5,
      tipoRam: "DDR4",
      clock: 3200,
      capacidade: "16GB",
      especificacoes: { latencia: "CL16", kit: "2x8GB" },
      estoque: 25,
      vendas: 210,
    },
    // Motherboards
    {
      nome: "ASUS TUF Gaming B550M-Plus",
      categoria: CategoriaComponente.PLACA_MAE,
      marca: "ASUS",
      modelo: "TUF B550M-Plus",
      preco: 899.00,
      tdp: 45,
      socket: "AM4",
      tipoRam: "DDR4",
      especificacoes: { chipset: "B550", formato: "Micro-ATX", slotsM2: 2, slotsRam: 4 },
      estoque: 14,
      vendas: 78,
    },
    {
      nome: "Gigabyte B760M DS3H DDR4",
      categoria: CategoriaComponente.PLACA_MAE,
      marca: "Gigabyte",
      modelo: "B760M DS3H",
      preco: 799.00,
      tdp: 55,
      socket: "LGA1700",
      tipoRam: "DDR4",
      especificacoes: { chipset: "B760", formato: "Micro-ATX", slotsM2: 2, slotsRam: 4 },
      estoque: 18,
      vendas: 45,
    },
    // PSUs (Fontes)
    {
      nome: "Corsair CV650 650W 80 Plus Bronze",
      categoria: CategoriaComponente.FONTE,
      marca: "Corsair",
      modelo: "CV650",
      preco: 399.90,
      tdp: 0,
      potencia: 650,
      especificacoes: { certificacao: "80 Plus Bronze", cabeamento: "Não Modular" },
      estoque: 15,
      vendas: 150,
    },
    {
      nome: "MSI MAG A650BN 650W 80 Plus Bronze",
      categoria: CategoriaComponente.FONTE,
      marca: "MSI",
      modelo: "MAG A650BN",
      preco: 329.00,
      potencia: 650,
      tdp: 0,
      especificacoes: { certificacao: "80 Plus Bronze", cabeamento: "Não Modular" },
      estoque: 30,
      vendas: 180,
    },
  ];

  for (const comp of componentes) {
    await prisma.componente.create({
      data: comp,
    });
  }

  // Inserir Jogos
  const jogos = [
    {
      nome: "Cyberpunk 2077",
      slug: "cyberpunk-2077",
      descricao: "RPG de ação e aventura em mundo aberto ambientado em Night City.",
      imagemUrl: "/images/cyberpunk2077.jpg",
      requisitosMinimos: {
        cpuMin: "Intel Core i5-8400 / AMD Ryzen 3 3100",
        gpuMin: "GTX 1060 6GB / AMD RX 580",
        ramGb: 12
      },
      requisitosRecomendados: {
        cpuRec: "Intel Core i7-9700 / AMD Ryzen 5 5600",
        gpuRec: "RTX 2060 / AMD RX 5700 XT",
        ramGb: 16
      },
      benchmarks: {
        low_1080p: 75,
        med_1080p: 60,
        high_1080p: 45,
        ultra_1440p: 30
      }
    },
    {
      nome: "Valorant",
      slug: "valorant",
      descricao: "Jogo de tiro tático 5v5 focado em personagens e precisão de tiro da Riot Games.",
      imagemUrl: "/images/valorant.jpg",
      requisitosMinimos: {
        cpuMin: "Intel Core i3-370M / AMD A8-7600",
        gpuMin: "Intel HD 4000 / AMD Radeon R5 240",
        ramGb: 4
      },
      requisitosRecomendados: {
        cpuRec: "Intel Core i5-4460 / AMD Ryzen 3 1200",
        gpuRec: "GTX 1050 Ti / AMD Radeon R9 270",
        ramGb: 8
      },
      benchmarks: {
        low_1080p: 240,
        med_1080p: 180,
        high_1080p: 144,
        ultra_1440p: 120
      }
    },
    {
      nome: "Grand Theft Auto V",
      slug: "gta-v",
      descricao: "Mundo aberto dinâmico da Rockstar Games com multiplayer ativo.",
      imagemUrl: "/images/gtav.jpg",
      requisitosMinimos: {
        cpuMin: "Intel Core 2 Quad Q6600 / AMD Phenom 9850",
        gpuMin: "NVIDIA 9800 GT 1GB / AMD HD 4870 1GB",
        ramGb: 4
      },
      requisitosRecomendados: {
        cpuRec: "Intel Core i5 3470 / AMD FX-8350",
        gpuRec: "NVIDIA GTX 660 2GB / AMD HD 7870 2GB",
        ramGb: 8
      },
      benchmarks: {
        low_1080p: 120,
        med_1080p: 95,
        high_1080p: 80,
        ultra_1440p: 60
      }
    }
  ];

  for (const jogo of jogos) {
    await prisma.jogo.create({
      data: jogo,
    });
  }

  console.log("Banco de dados semeado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
