import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative">
      {/* Background neon blur lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl w-full text-center space-y-12 relative z-10">
        <div className="space-y-4">
          <span className="px-4 py-1.5 text-xs font-bold tracking-widest text-cyan-400 bg-cyan-950/40 rounded-full border border-cyan-500/30 uppercase">
            Autoatendimento Inteligente
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white">
            PC <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">Analyzer</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">
            Escolha como quer encontrar seu próximo computador gamer de alto desempenho.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Card 1: Guided Flow */}
          <Link href="/kiosk/guiado" className="group block">
            <Card variant="glass" className="h-full border-cyan-500/15 group-hover:border-cyan-500/40 transition-all p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-950/50 flex items-center justify-center text-cyan-400 mb-6 border border-cyan-500/20 text-2xl font-bold group-hover:scale-110 transition-transform">
                  🧭
                </div>
                <h2 className="text-lg font-bold text-white mb-2 text-left">Fluxo Guiado</h2>
                <p className="text-slate-400 text-xs text-left leading-relaxed">
                  Monte passo a passo definindo orçamento, escolhendo jogos favoritos e visualizando gargalos de forma simplificada.
                </p>
              </div>
              <div className="mt-8 text-cyan-400 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Iniciar Montador &rarr;
              </div>
            </Card>
          </Link>

          {/* Card 2: AI Chat */}
          <Link href="/kiosk/chat" className="group block">
            <Card variant="glass" className="h-full border-pink-500/15 group-hover:border-pink-500/40 transition-all p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-pink-950/50 flex items-center justify-center text-pink-400 mb-6 border border-pink-500/20 text-2xl font-bold group-hover:scale-110 transition-transform">
                  💬
                </div>
                <h2 className="text-lg font-bold text-white mb-2 text-left">Assistente de Hardware</h2>
                <p className="text-slate-400 text-xs text-left leading-relaxed">
                  Converse diretamente com nossa inteligência artificial para tirar dúvidas sobre compatibilidade e receber builds prontas.
                </p>
              </div>
              <div className="mt-8 text-pink-400 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Falar com IA &rarr;
              </div>
            </Card>
          </Link>
        </div>

        <div className="pt-6">
          <Link href="/admin/dashboard" className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wider font-semibold border-b border-transparent hover:border-slate-300">
            Acessar Painel Lojista / Admin
          </Link>
        </div>
      </div>
    </main>
  );
}
