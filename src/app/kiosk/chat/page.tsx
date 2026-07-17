import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ChatKioskPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-6">
      <Card variant="glass" className="max-w-2xl w-full flex flex-col h-[75vh] border-pink-500/20">
        {/* Header */}
        <div className="border-b border-white/10 pb-4 mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
              Hardware Assistente IA
            </h1>
            <p className="text-xs text-slate-400">NLP & Análise em tempo real</p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
        </div>

        {/* Chat History View */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 text-sm scrollbar-thin">
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 text-slate-200 p-4 rounded-2xl rounded-tl-none max-w-[85%]">
              Olá! Sou o assistente de hardware do PC-analyzer. 
              <br/><br/>
              Diga o que você deseja jogar (ex: *Cyberpunk 2077, Valorant*) e qual é o seu orçamento máximo para eu recomendar o setup perfeito!
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="flex gap-2 border-t border-white/5 pt-4">
          <input
            type="text"
            placeholder="Ex: Quero rodar GTA V com R$ 4000..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-pink-500/50 transition-colors focus:ring-1 focus:ring-pink-500/30"
          />
          <Button variant="neon-pink">
            Enviar
          </Button>
        </div>
      </Card>
    </main>
  );
}
