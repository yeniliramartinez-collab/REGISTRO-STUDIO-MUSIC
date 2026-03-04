import { Shield, Library, UploadCloud, Gavel, Database } from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onSwitchView: (view: ViewType) => void;
}

export default function Sidebar({ currentView, onSwitchView }: SidebarProps) {
  const navItems = [
    { id: 'catalog', label: 'Catálogo Maestro', icon: Library },
    { id: 'library', label: 'Biblioteca Interna', icon: Database },
    { id: 'ingestion', label: 'Ingesta Masiva', icon: UploadCloud },
    { id: 'legal', label: 'Marco Jurídico', icon: Gavel },
  ] as const;

  return (
    <aside className="w-72 glass border-r border-slate-800 flex flex-col z-20 h-full">
      <div className="p-6 border-b border-slate-800/50 bg-gradient-to-b from-slate-900/80 to-transparent">
        <div className="flex flex-col items-center gap-4 mb-2 mt-4">
          {/* Premium Golden Logo */}
          <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-200 via-yellow-500 to-amber-700 shadow-[0_0_40px_rgba(217,119,6,0.3)] p-[2px] group hover:scale-105 transition-transform duration-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 to-slate-900 rounded-2xl"></div>
            <div className="relative z-10 flex items-center justify-center w-full h-full rounded-xl bg-gradient-to-b from-slate-900 to-black border border-yellow-500/30 overflow-hidden">
               {/* Inner glow */}
               <div className="absolute inset-0 bg-yellow-500/10 blur-xl rounded-full"></div>
               {/* Logo Mark */}
               <div className="relative flex flex-col items-center">
                 <span className="text-5xl font-black bg-gradient-to-br from-yellow-100 via-amber-400 to-yellow-700 bg-clip-text text-transparent tracking-tighter drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                   RS
                 </span>
                 <div className="w-8 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-1"></div>
               </div>
            </div>
          </div>
          
          {/* Typography */}
          <div className="text-center space-y-1">
            <h1 className="font-black text-xl tracking-tight bg-gradient-to-r from-yellow-100 via-amber-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-sm">
              REGISTER STUDIO
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-[1px] bg-amber-500/50"></div>
              <h2 className="font-bold text-[10px] tracking-[0.3em] text-amber-500/90 uppercase">
                Music Pro V 2.0
              </h2>
              <div className="w-4 h-[1px] bg-amber-500/50"></div>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSwitchView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-semibold ${
              currentView === item.id
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-600/10 text-amber-400 border border-amber-500/30 shadow-[inset_0_0_20px_rgba(217,119,6,0.1)]'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800 space-y-4">
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
            <span className="text-[10px] font-bold uppercase text-amber-500/80 tracking-wider">Motor Offline Activo</span>
          </div>
          <p className="text-[9px] text-slate-500 leading-tight italic">
            Tus datos nunca salen de este dispositivo. Generación local habilitada.
          </p>
        </div>
      </div>
    </aside>
  );
}
