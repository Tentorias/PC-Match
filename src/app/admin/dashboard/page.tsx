import { getDashboardStats } from "@/app/actions/dashboard";
import { Activity, Search, DollarSign, Target, Trophy, Flame } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8 relative z-10">
      <div>
        <h1 className="text-3xl font-bold text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)] mb-2">
          Visão Geral
        </h1>
        <p className="text-cyan-200/60">Acompanhe as métricas em tempo real do quiosque.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-400/20 transition-all"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shadow-[inset_0_0_15px_rgba(0,180,255,0.2)]">
              <Search className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-200/70">Total de Buscas</p>
              <p className="text-2xl font-bold text-white">{stats.totalBuscas}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-400 font-medium">
            <Activity className="w-3 h-3" />
            <span>+12% desde ontem</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-400/20 transition-all"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center shadow-[inset_0_0_15px_rgba(74,222,128,0.2)]">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-200/70">Ticket Médio</p>
              <p className="text-2xl font-bold text-white">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.orcamentoMedio)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50 font-medium">
            <span>Orçamento médio informado</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-400/20 transition-all"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 flex items-center justify-center shadow-[inset_0_0_15px_rgba(192,132,252,0.2)]">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-200/70">Taxa de Sucesso</p>
              <p className="text-2xl font-bold text-white">{stats.taxaSucesso.toFixed(1)}%</p>
            </div>
          </div>
          <div className="w-full bg-black/40 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-fuchsia-400 h-1.5 rounded-full"
              style={{ width: `${stats.taxaSucesso}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Seção de Jogos em Alta */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
          Jogos em Alta
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.topJogos.map((jogo, idx) => (
            <div key={jogo.nome} className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-1 shadow-[0_8px_24px_rgba(0,0,0,0.4)] relative overflow-hidden">
              {/* Glossy highlight top */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              
              <div className="bg-black/40 rounded-xl p-5 h-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-lg text-white/50">
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{jogo.nome}</h3>
                    <p className="text-xs text-cyan-300/60 font-medium">{jogo.contagem} buscas recentes</p>
                  </div>
                </div>
                {idx === 0 && (
                  <Trophy className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]" />
                )}
              </div>
            </div>
          ))}
          {stats.topJogos.length === 0 && (
            <div className="col-span-3 text-center py-12 text-white/40 font-medium">
              Nenhuma busca registrada ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
