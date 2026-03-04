import { useState } from 'react';
import { jsPDF } from 'jspdf';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CatalogView from './components/CatalogView';
import IngestionView from './components/IngestionView';
import LegalView from './components/LegalView';
import Toast from './components/Toast';
import ArkheIntentBar from './components/ArkheIntentBar';
import { Song, LegalData, ViewType } from './types';

import MusicLibrary from './components/MusicLibrary';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('catalog');
  const [songs, setSongs] = useState<Song[]>([]);
  const [legalData, setLegalData] = useState<LegalData>({
    author: 'Visionary Founder',
    album: 'Catálogo Maestro Vol. 1',
    declaration: 'Esta obra fue generada con asistencia de herramientas de inteligencia artificial, bajo la dirección creativa, edición, selección y curaduría humana del autor. El autor retiene el control absoluto sobre la narrativa, estructura y refinamiento final de la obra musical colectiva aquí presentada.'
  });
  const [toast, setToast] = useState<{ title: string; message: string; isError?: boolean } | null>(null);

  const showToast = (title: string, message: string, isError = false) => {
    setToast({ title, message, isError });
  };

  const handleIngest = (newSongs: Song[]) => {
    setSongs(prev => [...prev, ...newSongs]);
    showToast("Ingesta Completa", `${newSongs.length} obras procesadas localmente.`);
    setCurrentView('catalog');
  };

  const handleDelete = (id: number) => {
    setSongs(prev => prev.filter(s => s.id !== id));
    showToast("Obra Eliminada", "El registro ha sido borrado del catálogo local.");
  };

  const handleUpdateLegal = (data: Partial<LegalData>) => {
    setLegalData(prev => ({ ...prev, ...data }));
  };

  const handleExport = () => {
    if (songs.length === 0) {
      showToast("Error de Exportación", "Agregue al menos una obra al catálogo.", true);
      return;
    }

    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    // 1. PORTADA
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text(legalData.album.toUpperCase(), 20, 50);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`TITULAR DE DERECHOS: ${legalData.author}`, 20, 65);
    doc.text(`FECHA DE COMPILACIÓN: ${timestamp}`, 20, 72);
    
    // 2. DECLARACIÓN LEGAL IA
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DECLARACIÓN DE AUTORÍA E INTERVENCIÓN HUMANA:", 20, 95);
    
    doc.setFont("helvetica", "italic");
    const splitDeclaration = doc.splitTextToSize(legalData.declaration, 170);
    doc.text(splitDeclaration, 20, 105);

    // 3. TABLA DE CONTENIDOS
    doc.setFont("helvetica", "bold");
    doc.text("ÍNDICE DE OBRAS INCLUIDAS:", 20, 150);
    doc.setFont("helvetica", "normal");
    songs.forEach((song, i) => {
      if (i < 15) { // Limitar índice en portada
        doc.text(`${i+1}. ${song.title} (ID: ${song.hash.substring(0,8)})`, 25, 160 + (i * 7));
      }
    });

    // 4. GENERAR CADA CANCIÓN
    songs.forEach((song) => {
      doc.addPage();
      // Header por página
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`${legalData.album} | ID Único: ${song.hash}`, 20, 15);
      
      doc.setFontSize(20);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text(song.title, 20, 30);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(`Firma SHA-256: ${song.hash}`, 20, 38);
      
      doc.line(20, 42, 190, 42);
      
      doc.setTextColor(0);
      doc.setFontSize(11);
      const lyrics = doc.splitTextToSize(song.lyrics, 170);
      doc.text(lyrics, 20, 55);

      // Footer de Monetización
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`© ${new Date().getFullYear()} ${legalData.author}. Todos los derechos reservados. Licencia Internacional.`, 20, pageHeight - 15);
    });

    doc.save(`${legalData.album.replace(/\s+/g, '_')}_MASTER.pdf`);
    showToast("PDF Maestro Generado", "El archivo ha sido guardado en tu PC.");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#020617] text-[#f8fafc]">
      <Sidebar currentView={currentView} onSwitchView={setCurrentView} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <Header 
          currentView={currentView} 
          authorName={legalData.author} 
          onExport={handleExport} 
        />
        
        <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
          {currentView === 'catalog' && (
            <CatalogView songs={songs} onDelete={handleDelete} />
          )}
          {currentView === 'ingestion' && (
            <IngestionView onIngest={handleIngest} />
          )}
          {currentView === 'library' && (
            <MusicLibrary />
          )}
          {currentView === 'legal' && (
            <LegalView data={legalData} onUpdate={handleUpdateLegal} />
          )}
        </div>
        <ArkheIntentBar />
      </main>

      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          isError={toast.isError}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
