import { ShieldCheck, DollarSign, FileJson } from 'lucide-react';
import { LegalData } from '../types';
import { BMIService } from '../services/bmiService';

interface LegalViewProps {
  data: LegalData;
  onUpdate: (data: Partial<LegalData>) => void;
}

export default function LegalView({ data, onUpdate }: LegalViewProps) {
  const handleCreateBMI = async () => {
    const obra = {
      titulo: "Demo Arkhé",
      autor: data.author || "Hector Juarez",
      porcentaje_autor: 100,
      duracion: "3:45",
      genero: "Cinematic",
      idioma: "Instrumental"
    };

    const paquete = await BMIService.generarPaqueteBMI(obra);
    
    // Create a blob and download it to make it visible to the user
    const blob = new Blob([JSON.stringify(paquete, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BMI_Package_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert(`Paquete BMI Generado Exitosamente:\n\nSHA256: ${paquete.SHA256}\nEstado: ${paquete.Estado}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-10 animate-in fade-in duration-500">
      <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-3xl flex gap-6 items-start">
        <div className="p-4 bg-emerald-500 rounded-2xl text-white shadow-lg">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-emerald-400">Configuración de Titularidad Global</h4>
          <p className="text-slate-400 text-sm mt-1 leading-relaxed">
            Define los datos que se inyectarán en cada página del PDF para asegurar la monetización y el registro legal ante INDAUTOR y US Copyright Office.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nombre del Titular (Autor Legal)</label>
          <input
            type="text"
            value={data.author}
            onChange={(e) => onUpdate({ author: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Título de la Colección (Álbum)</label>
          <input
            type="text"
            value={data.album}
            onChange={(e) => onUpdate({ album: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Cláusula de Intervención Humana (IA Defense)</label>
        <textarea
          value={data.declaration}
          onChange={(e) => onUpdate({ declaration: e.target.value })}
          className="w-full h-48 bg-slate-900 border border-slate-700 rounded-2xl p-6 outline-none focus:ring-1 focus:ring-emerald-500 text-sm leading-relaxed text-slate-300 resize-none"
        />
        <p className="text-[10px] text-slate-600 italic">Esta declaración se inyectará al inicio de cada documento exportado.</p>
      </div>

      {/* BMI / PRO Section */}
      <div className="bg-indigo-500/10 border border-indigo-500/30 p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex gap-6 items-start">
          <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-indigo-400">Gestión de Regalías (PRO)</h4>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed max-w-lg">
              Genera paquetes de registro compatibles con BMI y ASCAP. Crea huellas digitales SHA-256 y metadatos JSON listos para ingesta en sociedades de gestión colectiva.
            </p>
          </div>
        </div>
        <button 
          onClick={handleCreateBMI}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 whitespace-nowrap"
        >
          <FileJson className="w-5 h-5" />
          Generar Registro BMI
        </button>
      </div>
    </div>
  );
}
