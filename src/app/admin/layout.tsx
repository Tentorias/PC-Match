import Link from "next/link";
import { LayoutDashboard, Package, Settings, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050B14] text-cyan-100 flex font-sans overflow-hidden">
      {/* Background Orbs & Gradients for Dark Frutiger Aero */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/20 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[150px]"></div>
        <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] rounded-full bg-teal-400/10 blur-[100px] mix-blend-screen"></div>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgNDBoNDBNNDAgMHY0MCIgc3Ryb2tlPSIjZmZmZmZmMDgiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-20"></div>
      </div>

      {/* Sidebar - Glassmorphism style */}
      <aside className="w-64 z-10 bg-white/5 backdrop-blur-xl border-r border-white/10 shadow-[4px_0_24px_rgba(0,180,255,0.1)] flex flex-col relative">
        {/* Glossy reflection overlay on sidebar */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
        
        <div className="p-6 relative z-10 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-[1px] shadow-[0_0_15px_rgba(0,180,255,0.4)]">
            <div className="w-full h-full rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">PC</span>
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">NexusAdmin</h1>
            <p className="text-xs text-cyan-300/70 font-medium">Lojista Portal</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 relative z-10">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-cyan-400/30 transition-all group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <LayoutDashboard className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            <span className="font-semibold text-white/90 group-hover:text-white drop-shadow-md">Dashboard</span>
          </Link>
          <Link href="/admin/estoque" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-400/30 transition-all group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-400/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <Package className="w-5 h-5 text-blue-400 group-hover:text-blue-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span className="font-semibold text-white/90 group-hover:text-white drop-shadow-md">Estoque de Peças</span>
          </Link>
        </nav>

        <div className="p-4 relative z-10">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-black/40 border border-white/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-300 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm">Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 h-screen overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-20 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse"></div>
            <span className="text-sm font-medium text-white/70">Sistema Online</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-cyan-200">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-300 p-[1px] shadow-[0_0_10px_rgba(0,180,255,0.3)] cursor-pointer">
              <div className="w-full h-full rounded-full bg-black/60 flex items-center justify-center">
                <span className="text-xs font-bold text-white">AD</span>
              </div>
            </div>
          </div>
        </header>
        
        <div className="p-8 pb-24">
          {children}
        </div>
      </main>
    </div>
  );
}
