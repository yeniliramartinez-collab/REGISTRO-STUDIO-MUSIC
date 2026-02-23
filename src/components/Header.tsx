import { Download } from 'lucide-react';

interface HeaderProps {
  currentView: 'catalog' | 'ingestion' | 'legal';
  authorName: string;
  onExport: () => void;
}

export default function Header({ currentView, authorName, onExport }: HeaderProps) {
  const titles = {
    catalog: { t: "Catálogo Maestro", d: "Gestión de activos musicales de alta escala" },
    ingestion: { t: "Ingesta Industrial", d: "Procesamiento de archivos TXT masivos" },
    legal: { t: "Marco Jurídico", d: "Blindaje y declaración de intervención humana" }
  };

  const { t, d } = titles[currentView];

  return (
    <header className="h-24 glass border-b border-slate-800 flex items-center justify-between px-10 z-10 shrink-0">
      <div>
        <h2 className="text-2xl font-black tracking-tight">{t}</h2>
        <p className="text-slate-500 text-xs">{d}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col text-right mr-4">
          <span className="text-sm font-bold text-emerald-400">{authorName || "Propietario Independiente"}</span>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Estado: Blindado</span>
        </div>
        <button
          onClick={onExport}
          className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-sm hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-xl cursor-pointer"
        >
          <Download className="w-4 h-4" />
          EXPORTAR HÍBRIDO
        </button>
      </div>
    </header>
  );
}
