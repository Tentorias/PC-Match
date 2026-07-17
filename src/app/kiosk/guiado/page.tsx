import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function GuidedKioskPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <Card variant="glass" className="max-w-xl w-full text-center p-8 border-cyan-500/20">
        <div className="mb-6 flex justify-center">
          <span className="px-3 py-1 text-xs font-semibold tracking-wider text-cyan-400 bg-cyan-950/50 rounded-full border border-cyan-500/30">
            PASSO 1 DE 4
          </span>
        </div>
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500 mb-4">
          Montagem Inteligente
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed mb-8">
          Descubra quais peças de hardware maximizam os quadros por segundo (FPS) dos seus jogos preferidos respeitando seu bolso.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="w-full sm:w-auto">
            Voltar
          </Button>
          <Button variant="neon-cyan" className="w-full sm:w-auto">
            Definir Orçamento
          </Button>
        </div>
      </Card>
    </main>
  );
}
