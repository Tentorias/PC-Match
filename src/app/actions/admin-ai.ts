"use server";

import { getJsonFromGemini } from "@/lib/gemini";
import { CategoriaComponente } from "@prisma/client";

const COMPONENTE_SCHEMA = `{
  "nome": "string (nome completo do produto)",
  "categoria": "CPU | GPU | RAM | PLACA_MAE | FONTE | COOLER | ARMAZENAMENTO | GABINETE",
  "marca": "string (ex: Intel, AMD, Corsair)",
  "modelo": "string",
  "tdp": "number (em watts)",
  "socket": "string (para CPU e PLACA_MAE, ou null)",
  "tipoRam": "string (para PLACA_MAE e RAM, ou null)",
  "clock": "number (em GHz para CPU/GPU ou MHz para RAM, ou null)",
  "potencia": "number (em watts para FONTE, ou null)",
  "capacidade": "string (ex: '16GB', '1TB SSD', '8GB VRAM', ou null)",
  "especificacoes": "object (detalhes técnicos adicionais, ex: cores/threads)"
}`;

export async function preencherComIA(nomeProduto: string) {
  const prompt = `Você é um especialista em hardware de computador. O lojista está tentando cadastrar uma peça com o nome "${nomeProduto}".
Por favor, identifique qual é essa peça, sua categoria exata e preencha o máximo de especificações técnicas precisas possíveis (TDP, socket, tipo de RAM, etc.).
Seja o mais assertivo possível nas especificações.`;

  try {
    const data = await getJsonFromGemini(prompt, COMPONENTE_SCHEMA);
    return { success: true, data };
  } catch (error) {
    console.error("Erro na AI Admin Action:", error);
    return { success: false, error: "Não foi possível extrair dados para esse componente." };
  }
}
