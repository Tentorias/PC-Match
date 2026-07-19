"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { obterJogosDisponiveis, processarRecomendacao } from "@/app/actions/otimizador";
import { Jogo, Componente } from "@/types";

type Step = 1 | 2 | 3 | 4;

export default function GuidedKioskPage() {
  const [step, setStep] = useState<Step>(1);
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [loadingJogos, setLoadingJogos] = useState(true);

  // Form State
  const [jogosSelecionados, setJogosSelecionados] = useState<Jogo[]>([]);
  const [resolucao, setResolucao] = useState<string>("1080p");
  const [orcamento, setOrcamento] = useState<number>(5000);
  const [foco, setFoco] = useState<"gpu" | "cpu">("gpu");

  const toggleJogoSelecionado = (jogo: Jogo) => {
    setJogosSelecionados((prev) => {
      const existe = prev.some((j) => j.id === jogo.id);
      if (existe) {
        return prev.filter((j) => j.id !== jogo.id);
      } else {
        return [...prev, jogo];
      }
    });
  };

  // Result State
  const [calculando, setCalculando] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [erroResultado, setErroResultado] = useState<string | null>(null);

  // Load games from DB
  useEffect(() => {
    async function fetchJogos() {
      try {
        const data = await obterJogosDisponiveis();
        setJogos(data as unknown as Jogo[]);
      } catch (err) {
        console.error("Erro ao carregar jogos:", err);
      } finally {
        setLoadingJogos(false);
      }
    }
    fetchJogos();
  }, []);

  const handleNextStep = () => {
    if (step === 1 && jogosSelecionados.length === 0) {
      alert("Por favor, selecione pelo menos um jogo para continuar.");
      return;
    }
    if (step < 4) {
      setStep((prev) => (prev + 1) as Step);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const iniciarCalculo = async () => {
    setCalculando(true);
    setErroResultado(null);
    setStep(3);

    // Simula carregamento gamer por 1.5s
    setTimeout(async () => {
      try {
        const res = await processarRecomendacao({
          orcamentoMax: orcamento,
          focoGpu: foco === "gpu",
          focoCpu: foco === "cpu",
          jogoNome: jogosSelecionados.map((j) => j.nome).join(" + "),
          resolucaoAlvo: resolucao,
        });

        if (res.sucesso && res.dados) {
          setResultado(res.dados);
          setStep(4);
        } else {
          setErroResultado(res.mensagem);
          setStep(4);
        }
      } catch (err) {
        setErroResultado("Ocorreu um erro ao calcular a melhor recomendação.");
        setStep(4);
      } finally {
        setCalculando(false);
      }
    }, 1500);
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  // Calcular nota de Upgradability (Longevidade)
  const calcularUpgradability = (componentes: Componente[]) => {
    const placaMae = componentes.find((c) => c.categoria === "PLACA_MAE");
    const fonte = componentes.find((c) => c.categoria === "FONTE");
    
    let nota = 5; // Base inicial
    
    if (placaMae) {
      if (placaMae.socket === "AM5" || placaMae.tipoRam === "DDR5") {
        nota += 3; // Soquete e RAM modernos e com longevidade garantida
      } else if (placaMae.socket === "LGA1700") {
        nota += 1.5;
      }
    }
    
    if (fonte) {
      if ((fonte.potencia || 0) >= 750) {
        nota += 2;
      } else if ((fonte.potencia || 0) >= 650) {
        nota += 1;
      }
    }
    
    return Math.min(10, nota);
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-16 relative">
      {/* Glow ambient background lights */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

      {step < 3 && (
        <div className="w-full max-w-4xl mb-8">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-widest px-2">
            <span>Passo {step} de 2</span>
            <span>{step === 1 ? "Requisitos do Setup" : "Orçamento e Foco"}</span>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-300"
              style={{ width: `${step * 50}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: SELECT GAMES AND RESOLUTION */}
      {step === 1 && (
        <Card variant="glass" className="max-w-4xl w-full p-6 md:p-10 border-white/5 relative">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Qual jogo você quer rodar?
              </h1>
              <p className="text-slate-400 text-sm">
                O algoritmo utilizará os requisitos reais deste jogo para recomendar o hardware ideal.
              </p>
            </div>

            {loadingJogos ? (
              <div className="h-48 flex items-center justify-center text-cyan-400 font-semibold gap-2 animate-pulse">
                <span>⚡</span> Carregando biblioteca de jogos...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {jogos.map((jogo) => {
                  const selecionado = jogosSelecionados.some((j) => j.id === jogo.id);
                  return (
                    <button
                      key={jogo.id}
                      onClick={() => toggleJogoSelecionado(jogo)}
                      className={`p-6 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between h-40 relative group/game ${
                        selecionado
                          ? "bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                          : "bg-slate-950/60 border-white/5 hover:border-white/10 hover:bg-slate-950/90"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-3xl">🎮</span>
                        {selecionado && (
                          <span className="text-xs font-bold text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Selecionado
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base leading-tight">
                          {jogo.nome}
                        </h3>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">
                          {jogo.descricao}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="border-t border-white/5 pt-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                Resolução Alvo
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "1080p", label: "Full HD (1080p)", desc: "Mais comum / Competitivo" },
                  { value: "1440p", label: "Quad HD (1440p)", desc: "Excelente nitidez" },
                  { value: "4K", label: "Ultra HD (4K)", desc: "Máxima qualidade visual" },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setResolucao(item.value)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      resolucao === item.value
                        ? "bg-pink-500/10 border-pink-500 shadow-[0_0_15px_rgba(219,39,119,0.15)]"
                        : "bg-slate-950/40 border-white/5 hover:bg-slate-950/70"
                    }`}
                  >
                    <div className="font-bold text-white text-xs">{item.label}</div>
                    <div className="text-[9px] text-slate-500 mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                variant="neon-cyan"
                onClick={handleNextStep}
                disabled={jogosSelecionados.length === 0}
                className="w-full sm:w-auto"
              >
                Continuar &rarr;
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 2: BUDGET AND PREFERENCES */}
      {step === 2 && (
        <Card variant="glass" className="max-w-xl w-full p-6 md:p-8 border-white/5">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-white">Quanto quer investir?</h1>
              <p className="text-slate-400 text-sm">
                Encontraremos as melhores peças compatíveis sem passar do seu limite.
              </p>
            </div>

            {/* Valor Input */}
            <div className="space-y-2">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                  R$
                </span>
                <input
                  type="number"
                  value={orcamento}
                  onChange={(e) => setOrcamento(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-12 py-4 text-xl font-bold text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              {/* Presets */}
              <div className="grid grid-cols-4 gap-2">
                {[3000, 5000, 8000, 12000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setOrcamento(val)}
                    className="py-2 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
                  >
                    R$ {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Foco Options */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Qual o seu foco principal?
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setFoco("gpu")}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    foco === "gpu"
                      ? "bg-cyan-500/10 border-cyan-500"
                      : "bg-slate-950/40 border-white/5"
                  }`}
                >
                  <div className="text-xl mb-1">🎮</div>
                  <div className="font-bold text-white text-xs">Foco em Gráficos (GPU)</div>
                  <p className="text-[9px] text-slate-500 mt-1">
                    Melhor qualidade de imagem e jogos pesados.
                  </p>
                </button>
                <button
                  onClick={() => setFoco("cpu")}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    foco === "cpu"
                      ? "bg-pink-500/10 border-pink-500"
                      : "bg-slate-950/40 border-white/5"
                  }`}
                >
                  <div className="text-xl mb-1">⚡</div>
                  <div className="font-bold text-white text-xs">Foco em Performance (CPU)</div>
                  <p className="text-[9px] text-slate-500 mt-1">
                    Ideal para FPS competitivo (Valorant, CS).
                  </p>
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={handlePrevStep} className="w-1/3">
                Voltar
              </Button>
              <Button variant="neon-pink" onClick={iniciarCalculo} className="w-2/3">
                Montar PC ⚡
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 3: LOADING SCREEN */}
      {step === 3 && (
        <Card variant="glass" className="max-w-md w-full p-10 text-center border-cyan-500/20">
          <div className="space-y-6 flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Calculando melhor combinação...</h2>
              <p className="text-slate-500 text-xs tracking-wider uppercase animate-pulse">
                Varrendo estoque de peças • Conferindo Socket • Calculando gargalo
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 4: RESULT SCREEN */}
      {step === 4 && (
        <div className="w-full max-w-4xl space-y-6">
          {erroResultado ? (
            <Card variant="glass" className="text-center p-10 border-pink-500/20">
              <span className="text-4xl">⚠️</span>
              <h2 className="text-xl font-bold text-white mt-4 mb-2">Ops! Sem combinações</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">{erroResultado}</p>
              <Button variant="neon-cyan" onClick={() => setStep(2)}>
                Ajustar Orçamento
              </Button>
            </Card>
          ) : (
            <>
              {/* Header metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card variant="neon" hoverEffect={false} className="p-4 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                    Preço Total
                  </span>
                  <span className="text-xl font-extrabold text-cyan-400">
                    {formatarMoeda(resultado.precoTotal)}
                  </span>
                </Card>
                <Card variant="neon" hoverEffect={false} className="p-4 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                    Margem de Orçamento
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    Sobrou {formatarMoeda(orcamento - resultado.precoTotal)}
                  </span>
                </Card>
                <Card variant="neon" hoverEffect={false} className="p-4 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                    Longevidade (Upgrade)
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-extrabold text-pink-500">
                      {calcularUpgradability(resultado.componentes)}/10
                    </span>
                    <span className="text-[8px] text-slate-500 border border-slate-800 rounded px-1 uppercase">
                      Nota de Upgrade
                    </span>
                  </div>
                </Card>
                <Card variant="neon" hoverEffect={false} className="p-4 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                    Status de Gargalo
                  </span>
                  <span className="text-xs font-semibold text-white leading-tight">
                    {resultado.gargalo}
                  </span>
                </Card>
              </div>

              {/* Component breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-3">
                  <h2 className="text-lg font-bold text-white px-2">Peças Selecionadas</h2>
                  <div className="space-y-2">
                    {resultado.componentes.map((c: Componente) => (
                      <div
                        key={c.id}
                        className="bg-slate-950/60 border border-white/5 hover:border-white/10 rounded-xl p-4 flex items-center justify-between transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">
                            {c.categoria === "CPU"
                              ? "💻"
                              : c.categoria === "GPU"
                              ? "📼"
                              : c.categoria === "RAM"
                              ? "💾"
                              : c.categoria === "PLACA_MAE"
                              ? "🎛️"
                              : "🔌"}
                          </span>
                          <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">
                              {c.categoria}
                            </div>
                            <div className="font-bold text-white text-sm">{c.nome}</div>
                          </div>
                        </div>
                        <div className="font-bold text-cyan-400 text-sm">
                          {formatarMoeda(c.preco)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar details */}
                <div className="space-y-6">
                  {/* YouTube Benchmarks integration */}
                  <Card variant="glass" hoverEffect={false} className="space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <span>🎬</span> Proof of Performance
                    </h3>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Veja testes em tempo real de benchmarks com essa configuração para os seus jogos no YouTube:
                    </p>
                    <div className="flex flex-col gap-2">
                      {jogosSelecionados.map((jogo) => {
                        const cpu = resultado.componentes.find((c: Componente) => c.categoria === "CPU");
                        const gpu = resultado.componentes.find((c: Componente) => c.categoria === "GPU");
                        if (cpu && gpu) {
                          const query = encodeURIComponent(
                            `${cpu.modelo} + ${gpu.modelo} + ${jogo.nome} Benchmark`
                          );
                          return (
                            <a
                              key={jogo.id}
                              href={`https://www.youtube.com/results?search_query=${query}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex w-full justify-between items-center px-3 py-2 bg-red-600/10 hover:bg-red-600/20 text-white border border-red-500/20 hover:border-red-500/40 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                            >
                              <span className="truncate max-w-[140px]">{jogo.nome}</span>
                              <span className="text-red-400 font-bold flex items-center gap-1 shrink-0">
                                Assistir 📺
                              </span>
                            </a>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </Card>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button variant="neon-cyan" onClick={() => window.print()} className="w-full">
                      🖨️ Imprimir Orçamento
                    </Button>
                    <Button variant="outline" onClick={() => setStep(1)} className="w-full">
                      🔄 Refazer Montagem
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}
