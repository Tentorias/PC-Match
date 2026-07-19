-- CreateEnum
CREATE TYPE "CategoriaComponente" AS ENUM ('CPU', 'GPU', 'RAM', 'PLACA_MAE', 'FONTE', 'COOLER', 'ARMAZENAMENTO', 'GABINETE');

-- CreateTable
CREATE TABLE "Componente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" "CategoriaComponente" NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "tdp" INTEGER NOT NULL,
    "socket" TEXT,
    "tipoRam" TEXT,
    "clock" DOUBLE PRECISION,
    "potencia" INTEGER,
    "capacidade" TEXT,
    "especificacoes" JSONB NOT NULL,
    "estoque" INTEGER NOT NULL DEFAULT 0,
    "vendas" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Componente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jogo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT,
    "imagemUrl" TEXT,
    "requisitosMinimos" JSONB NOT NULL,
    "requisitosRecomendados" JSONB NOT NULL,
    "benchmarks" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogBusca" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orcamento" DOUBLE PRECISION,
    "jogoNome" TEXT,
    "resolucaoAlvo" TEXT,
    "sucesso" BOOLEAN NOT NULL DEFAULT true,
    "componentesIds" JSONB,

    CONSTRAINT "LogBusca_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Jogo_nome_key" ON "Jogo"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Jogo_slug_key" ON "Jogo"("slug");
