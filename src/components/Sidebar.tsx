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
      <div className="p-8 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-500 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Shield className="text-white w-6 h-6" />
          </div>
          <h1 className="font-black text-2xl tracking-tighter">ARKHÉ</h1>
        </div>
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Hybrid IP Factory v1.0</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSwitchView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold ${
              currentView === item.id
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:bg-slate-800'
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
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Motor Offline Activo</span>
          </div>
          <p className="text-[9px] text-slate-500 leading-tight italic">
            Tus datos nunca salen de este dispositivo. Generación local habilitada.
          </p>
        </div>
      </div>
    </aside>
  );
}
