import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function EstoqueAdminPage() {
  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Estoque Inteligente</h1>
          <p className="text-sm text-slate-400">Gerencie preços, TDPs, compatibilidade e cadastro de peças.</p>
        </div>
        <Button variant="neon-cyan">
          Cadastrar Componente
        </Button>
      </div>

      <Card variant="glass" className="p-0 border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-xs tracking-wider border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Componente</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Especificações</th>
                <th className="px-6 py-4">Preço</th>
                <th className="px-6 py-4">Estoque</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* Exemplo de item */}
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-white">AMD Ryzen 5 5600</div>
                  <div className="text-xs text-slate-400">AMD</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 text-xs rounded bg-cyan-950 text-cyan-400 border border-cyan-500/20">
                    CPU
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">
                  Socket: AM4 | TDP: 65W | Cores: 6
                </td>
                <td className="px-6 py-4 font-medium text-emerald-400">R$ 849,90</td>
                <td className="px-6 py-4 text-slate-200">15 un.</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                    Editar
                  </button>
                  <button className="text-xs text-pink-500 hover:text-pink-400 transition-colors font-medium">
                    Excluir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}
