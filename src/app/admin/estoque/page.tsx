"use client";

import { useState, useEffect } from "react";
import { Sparkles, Plus, Save, Trash2, Cpu, Edit2, X } from "lucide-react";
import { preencherComIA } from "@/app/actions/admin-ai";
import { listarComponentes, salvarComponente, excluirComponente } from "@/app/actions/estoque";
import { Componente, CategoriaComponente } from "@prisma/client";

export default function EstoquePage() {
  const [componentes, setComponentes] = useState<Componente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [nomeBusca, setNomeBusca] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Componente>>({
    id: undefined,
    nome: "",
    categoria: "CPU",
    marca: "",
    modelo: "",
    preco: 0,
    estoque: 0,
    tdp: 0,
  });

  const resetForm = () => {
    setFormData({ id: undefined, nome: "", categoria: "CPU", marca: "", modelo: "", preco: 0, estoque: 0, tdp: 0 });
    setNomeBusca("");
  };

  const carregarEstoque = async () => {
    setIsLoading(true);
    const dados = await listarComponentes();
    setComponentes(dados);
    setIsLoading(false);
  };

  useEffect(() => {
    carregarEstoque();
  }, []);

  const handlePreencherIA = async () => {
    if (!nomeBusca) return alert("Digite o nome da peça primeiro!");
    
    setIsAiLoading(true);
    const res = await preencherComIA(nomeBusca);
    setIsAiLoading(false);
    
    if (res.success && res.data) {
      setFormData(prev => ({
        ...prev,
        ...res.data,
        nome: res.data.nome || nomeBusca,
      }));
    } else {
      alert("Falha ao buscar dados com IA: " + (res.error || "Erro desconhecido"));
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || formData.preco === undefined) return;
    
    setIsSaving(true);

    const dataToSave = {
      ...formData,
      preco: Number(formData.preco),
      tdp: Number(formData.tdp),
      estoque: Number(formData.estoque),
      especificacoes: formData.especificacoes || {},
    } as any;

    const res = await salvarComponente(dataToSave);
    setIsSaving(false);
    
    if (res.success) {
      setIsSaved(true);
      resetForm();
      carregarEstoque();
      
      setTimeout(() => {
        setIsSaved(false);
      }, 2500);
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="space-y-8 relative z-10">
      <div>
        <h1 className="text-3xl font-bold text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)] mb-2">
          Gestão de Estoque
        </h1>
        <p className="text-cyan-200/60">Cadastre e gerencie as peças usando Inteligência Artificial.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulário de Cadastro */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {formData.id ? (
                  <><Edit2 className="w-5 h-5 text-yellow-400" /> Editar Componente</>
                ) : (
                  <><Plus className="w-5 h-5 text-cyan-400" /> Novo Componente</>
                )}
              </h2>
              {formData.id && (
                <button onClick={resetForm} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Smart Input (IA) */}
            <div className="mb-6 p-4 bg-black/40 rounded-xl border border-cyan-500/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5"></div>
              <label className="block text-xs font-medium text-cyan-300/80 mb-2 uppercase tracking-wider relative z-10">
                Cadastro Inteligente
              </label>
              <div className="flex gap-2 relative z-10">
                <input 
                  type="text" 
                  value={nomeBusca}
                  onChange={(e) => setNomeBusca(e.target.value)}
                  placeholder="Ex: Ryzen 7 7800X3D"
                  className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button 
                  type="button"
                  onClick={handlePreencherIA}
                  disabled={isAiLoading}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white p-2 rounded-lg flex items-center justify-center gap-1 shadow-[0_0_15px_rgba(0,180,255,0.4)] disabled:opacity-50 transition-all font-semibold px-4"
                >
                  {isAiLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Auto
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Campos Form */}
            <form onSubmit={handleSalvar} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs text-white/60 mb-1">Nome Final</label>
                <input required type="text" value={formData.nome || ""} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/60 mb-1">Categoria</label>
                  <select value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value as CategoriaComponente})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white">
                    {Object.keys(CategoriaComponente).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Preço (R$)</label>
                  <input required type="number" step="0.01" value={formData.preco || ""} onChange={e => setFormData({...formData, preco: Number(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Estoque</label>
                  <input required type="number" value={formData.estoque || 0} onChange={e => setFormData({...formData, estoque: Number(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">TDP (Watts)</label>
                  <input type="number" value={formData.tdp || 0} onChange={e => setFormData({...formData, tdp: Number(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Socket</label>
                  <input type="text" value={formData.socket || ""} onChange={e => setFormData({...formData, socket: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Memória / Tipo</label>
                  <input type="text" value={formData.tipoRam || ""} onChange={e => setFormData({...formData, tipoRam: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className={`flex-1 font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                    isSaved 
                      ? "bg-green-500 hover:bg-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] border border-green-400/50" 
                      : "bg-white/10 hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] border border-white/20 hover:border-blue-400 text-white"
                  }`}
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : isSaved ? (
                    <>
                      <span className="text-xl">✅</span>
                      {formData.id ? "Atualizado!" : "Salvo com sucesso!"}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {formData.id ? "Atualizar" : "Salvar no Estoque"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Lista de Peças */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] h-[700px] flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              Catálogo Atual
            </h2>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {isLoading ? (
                <div className="text-center text-white/50 py-10">Carregando estoque...</div>
              ) : componentes.length === 0 ? (
                <div className="text-center text-white/50 py-10">Nenhum componente cadastrado.</div>
              ) : (
                componentes.map(comp => (
                  <div key={comp.id} className="bg-black/30 border border-white/5 hover:border-white/20 rounded-xl p-4 flex items-center justify-between transition-colors group">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-cyan-300">
                          {comp.categoria}
                        </span>
                        <span className="text-xs text-white/50">{comp.marca}</span>
                      </div>
                      <h3 className="font-bold text-white text-sm">{comp.nome}</h3>
                      <div className="flex gap-3 text-xs text-white/40 mt-2">
                        {comp.socket && <span>Socket: {comp.socket}</span>}
                        {comp.tdp > 0 && <span>TDP: {comp.tdp}W</span>}
                        <span>Estoque: {comp.estoque}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-green-400 font-bold">R$ {comp.preco.toFixed(2)}</div>
                      </div>
                      <button 
                        onClick={() => {
                          setFormData(comp);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="p-2 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500 hover:text-black rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Editar componente"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={async () => {
                          if(confirm('Tem certeza?')) {
                            await excluirComponente(comp.id);
                            carregarEstoque();
                          }
                        }}
                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Excluir componente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
