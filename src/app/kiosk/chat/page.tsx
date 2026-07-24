"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Cpu, RotateCcw } from "lucide-react";
import { processarMensagemChat } from "@/app/actions/chat";
import { Componente } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
  buildResult?: any;
};

export default function ChatKioskPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      text: "Olá! Sou o Assistente da PC Nexus. Me conte o que você procura! (Ex: Quero rodar GTA V e CS:GO gastando até R$ 5.000)",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    
    const newMsg: Message = { id: Date.now().toString(), role: "user", text: userText };
    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(true);

    try {
      // Build historico (últimas 6 mensagens)
      const historicoTexto = messages.slice(-6).map(m => `${m.role === 'bot' ? 'Assistente' : 'Cliente'}: ${m.text}`).join('\n');

      const response = await processarMensagemChat(userText, historicoTexto);

      setIsLoading(false);
      
      if (response.type === "chat") {
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: "bot", text: response.message },
        ]);
      } else if (response.type === "build") {
        setMessages((prev) => [
          ...prev,
          { 
            id: (Date.now() + 1).toString(), 
            role: "bot", 
            text: response.message,
            buildResult: response.buildResult
          },
        ]);
      }
    } catch (err) {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "bot", text: "Erro de conexão com o servidor. Tente atualizar a página." },
      ]);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 md:py-10 relative h-full">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <Card variant="glass" className="max-w-4xl w-full h-[80vh] flex flex-col overflow-hidden border-white/10 shadow-[0_0_40px_rgba(0,180,255,0.15)]">
        {/* Header */}
        <div className="h-16 border-b border-white/10 bg-black/40 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 p-[1px] shadow-[0_0_15px_rgba(0,180,255,0.4)]">
              <div className="w-full h-full bg-black/80 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-white leading-tight">Nexus AI</h1>
              <p className="text-xs text-cyan-400/80 font-medium">Assistente de Montagem</p>
            </div>
          </div>
          <button 
            onClick={() => setMessages([messages[0]])}
            className="p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-xs font-semibold">Reiniciar</span>
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}>
              <div className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  msg.role === "user" 
                    ? "bg-slate-800 text-slate-300" 
                    : "bg-cyan-900/50 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                }`}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={`p-4 rounded-2xl ${
                  msg.role === "user" 
                    ? "bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-tr-sm border border-white/5" 
                    : "bg-black/60 text-white rounded-tl-sm border border-cyan-500/20 backdrop-blur-md"
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>

              {/* Se for uma build, renderiza o resultado abaixo da mensagem */}
              {msg.buildResult && (
                <div className="mt-4 ml-11 w-[90%] max-w-2xl bg-black/60 border border-cyan-500/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(0,180,255,0.15)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
                  
                  {!msg.buildResult.sucesso ? (
                    <div className="text-red-400 font-medium">⚠️ {msg.buildResult.mensagem}</div>
                  ) : (
                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-end border-b border-white/10 pb-4">
                        <div>
                          <p className="text-xs text-cyan-400 uppercase tracking-wider font-bold mb-1">Total Calculado</p>
                          <p className="text-2xl font-black text-white">{formatarMoeda(msg.buildResult.dados.precoTotal)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1">Gargalo</p>
                          <p className="text-xs font-semibold text-pink-400">{msg.buildResult.dados.gargalo}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {msg.buildResult.dados.componentes.map((c: Componente) => (
                          <div key={c.id} className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3 flex justify-between items-center transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">
                                {c.categoria === "CPU" ? "💻" : c.categoria === "GPU" ? "📼" : c.categoria === "RAM" ? "💾" : c.categoria === "PLACA_MAE" ? "🎛️" : "🔌"}
                              </span>
                              <div>
                                <div className="text-[10px] text-cyan-400/70 font-bold uppercase tracking-wider">{c.categoria}</div>
                                <div className="text-sm font-semibold text-white/90">{c.nome}</div>
                              </div>
                            </div>
                            <div className="font-bold text-cyan-300 text-sm">{formatarMoeda(c.preco)}</div>
                          </div>
                        ))}
                      </div>

                      <Button variant="neon-cyan" className="w-full mt-2">
                        🖨️ Imprimir Orçamento
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-black/60 rounded-2xl rounded-tl-sm border border-cyan-500/20 p-4 flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/60 border-t border-white/10 shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex: Quero um PC para CS:GO até 4000 reais..."
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 rounded-2xl pl-5 pr-14 py-4 text-white focus:outline-none transition-colors shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 text-black rounded-xl flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-center mt-3 text-xs font-medium text-white/30">
            Inteligência Artificial alimentada por Gemini 1.5 Pro
          </div>
        </div>
      </Card>
    </main>
  );
}
