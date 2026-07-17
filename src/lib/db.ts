import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient; pgPool: Pool };

let prismaInstance: PrismaClient;

// Utiliza o DATABASE_URL do ambiente com fallback seguro para evitar erros em tempo de build
const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/pc_analyzer?schema=public";

if (process.env.NODE_ENV === "production") {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prismaInstance = new PrismaClient({
    adapter,
  });
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.pgPool = new Pool({ connectionString });
    const adapter = new PrismaPg(globalForPrisma.pgPool);
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: ["query", "error", "warn"],
    });
  }
  prismaInstance = globalForPrisma.prisma;
}

export const prisma = prismaInstance;
export const pgPool = globalForPrisma.pgPool;
