import React from "react";
import { Card } from "@/components/ui/Card";

export default function DashboardAdminPage() {
  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Painel Executivo</h1>
        <p className="text-sm text-slate-400">Métricas de comportamento de clientes e performance de estoque.</p>
      </div>

      {/* Grid de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card variant="glass" className="p-6 border-cyan-500/10">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Buscas Realizadas</p>
          <div className="flex justify-between items-baseline">
            <span className="text-3xl font-extrabold text-cyan-400">1,482</span>
            <span className="text-xs text-emerald-500 font-medium">+12.3% (semana)</span>
          </div>
        </Card>

        <Card variant="glass" className="p-6 border-pink-500/10">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Orçamento Médio</p>
          <div className="flex justify-between items-baseline">
            <span className="text-3xl font-extrabold text-pink-500">R$ 5.250</span>
            <span className="text-xs text-slate-400 font-medium">Resol. Alvo: 1080p</span>
          </div>
        </Card>

        <Card variant="glass" className="p-6 border-emerald-500/10">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Itens em Alerta (Estoque)</p>
          <div className="flex justify-between items-baseline">
            <span className="text-3xl font-extrabold text-emerald-400">4 peças</span>
            <span className="text-xs text-pink-400 font-medium">Reabastecer</span>
          </div>
        </Card>
      </div>

      {/* Grid de Detalhes Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="flat" className="p-6">
          <h2 className="text-base font-bold text-white mb-4">Jogos Mais Selecionados</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-300">1. Cyberpunk 2077</span>
              <span className="font-semibold text-cyan-400">42% das buscas</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full" style={{ width: "42%" }} />
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-300">2. Valorant</span>
              <span className="font-semibold text-pink-500">35% das buscas</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
              <div className="bg-pink-500 h-full rounded-full" style={{ width: "35%" }} />
            </div>
          </div>
        </Card>

        <Card variant="flat" className="p-6">
          <h2 className="text-base font-bold text-white mb-4">Alertas de Gargalo Frequentes</h2>
          <div className="space-y-4 text-sm text-slate-300">
            <div className="p-3 bg-pink-950/20 border border-pink-500/20 rounded-xl">
              <span className="font-semibold text-pink-400 block mb-1">Processador Subdimensionado</span>
              Usuários tentando parear Ryzen 5 3600 com RTX 4070 Ti devido ao orçamento limitado.
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
