"use server";

import { Componente, CategoriaComponente } from "@prisma/client";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function listarComponentes() {
  return await prisma.componente.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function salvarComponente(data: any) {
  try {
    if (data.id) {
      await prisma.componente.update({
        where: { id: data.id },
        data: {
          nome: data.nome,
          categoria: data.categoria,
          marca: data.marca,
          modelo: data.modelo,
          preco: data.preco,
          estoque: data.estoque,
          tdp: data.tdp,
          socket: data.socket,
          tipoRam: data.tipoRam,
          frequenciaRam: data.frequenciaRam,
          capacidadeGB: data.capacidadeGB,
          especificacoes: data.especificacoes,
        }
      });
    } else {
      await prisma.componente.create({
        data: {
          ...data,
        }
      });
    }
    revalidatePath('/admin/estoque');
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar componente:", error);
    return { success: false, error: "Falha ao salvar componente no banco." };
  }
}

export async function excluirComponente(id: number) {
  try {
    await prisma.componente.delete({ where: { id } });
    revalidatePath('/admin/estoque');
    return { success: true };
  } catch (error) {
    return { success: false, error: "Falha ao excluir componente." };
  }
}
