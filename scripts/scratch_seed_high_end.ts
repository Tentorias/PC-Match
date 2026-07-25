import { prisma } from './src/lib/db';

const gpus = [
  {
    nome: 'GeForce RTX 3080 10GB',
    categoria: 'GPU' as const,
    marca: 'NVIDIA',
    modelo: 'RTX 3080',
    preco: 3500.0,
    tdp: 320,
    clock: 1.71,
    capacidade: '10GB GDDR6X',
    estoque: 10,
    especificacoes: { cudaCores: 8704, rayTracing: '2nd Gen', dlss: '2.0' },
  },
  {
    nome: 'GeForce RTX 3090 24GB',
    categoria: 'GPU' as const,
    marca: 'NVIDIA',
    modelo: 'RTX 3090',
    preco: 6000.0,
    tdp: 350,
    clock: 1.70,
    capacidade: '24GB GDDR6X',
    estoque: 5,
    especificacoes: { cudaCores: 10496, rayTracing: '2nd Gen', dlss: '2.0', foco: '4K/8K Gaming' },
  },
  {
    nome: 'GeForce RTX 4080 SUPER 16GB',
    categoria: 'GPU' as const,
    marca: 'NVIDIA',
    modelo: 'RTX 4080 SUPER',
    preco: 7500.0,
    tdp: 320,
    clock: 2.55,
    capacidade: '16GB GDDR6X',
    estoque: 7,
    especificacoes: { cudaCores: 10240, rayTracing: '3rd Gen', dlss: '3.0' },
  },
  {
    nome: 'GeForce RTX 4090 24GB',
    categoria: 'GPU' as const,
    marca: 'NVIDIA',
    modelo: 'RTX 4090',
    preco: 14000.0,
    tdp: 450,
    clock: 2.52,
    capacidade: '24GB GDDR6X',
    estoque: 3,
    especificacoes: { cudaCores: 16384, rayTracing: '3rd Gen', dlss: '3.0', enthusiast: true },
  },
  {
    nome: 'Radeon RX 7900 XTX 24GB',
    categoria: 'GPU' as const,
    marca: 'AMD',
    modelo: 'RX 7900 XTX',
    preco: 7000.0,
    tdp: 355,
    clock: 2.5,
    capacidade: '24GB GDDR6',
    estoque: 5,
    especificacoes: { streamProcessors: 6144, architecture: 'RDNA 3' },
  },
  {
    nome: 'Radeon RX 9060 12GB (Concept)',
    categoria: 'GPU' as const,
    marca: 'AMD',
    modelo: 'RX 9060',
    preco: 2500.0,
    tdp: 150,
    clock: 3.2,
    capacidade: '12GB GDDR7',
    estoque: 10,
    especificacoes: { architecture: 'RDNA 5 (Rumored)', nextGen: true },
  },
  {
    nome: 'Radeon RX 9070 16GB (Concept)',
    categoria: 'GPU' as const,
    marca: 'AMD',
    modelo: 'RX 9070',
    preco: 4500.0,
    tdp: 250,
    clock: 3.4,
    capacidade: '16GB GDDR7',
    estoque: 5,
    especificacoes: { architecture: 'RDNA 5 (Rumored)', nextGen: true },
  },
];

async function main() {
  console.log('Iniciando seed de GPUs High-End...');
  for (const gpu of gpus) {
    const criada = await prisma.componente.create({
      data: gpu,
    });
    console.log(`Adicionado: ${criada.nome}`);
  }
  console.log('Seed de GPUs concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
