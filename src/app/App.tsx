import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardView from "../components/DashboardView";
import CatalogView from "../components/CatalogView";
import IngestionView from "../components/IngestionView";
import MusicLibrary from "../components/MusicLibrary";
import LegalView from "../components/LegalView";
import MarketplaceView from "../components/MarketplaceView";
import ArkheIntentBar from "../components/ArkheIntentBar";
import { ViewType, LegalData } from "../types";
import "../styles/arkheUI.css";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [legalData, setLegalData] = useState<LegalData>({
    author: "ARKHÉ User",
    album: "Single",
    declaration: "100% Original"
  });

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden text-slate-300 selection:bg-cyan-500/30">
      <Sidebar currentView={currentView} onSwitchView={setCurrentView} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-24">
          {currentView === 'dashboard' && <DashboardView onNavigate={setCurrentView} />}
          {currentView === 'catalog' && <CatalogView />}
          {currentView === 'ingestion' && <IngestionView />}
          {currentView === 'library' && <MusicLibrary />}
          {currentView === 'legal' && <LegalView data={legalData} onUpdate={(d) => setLegalData({ ...legalData, ...d })} />}
          {currentView === 'marketplace' && <MarketplaceView />}
        </div>
        
        <ArkheIntentBar />
      </main>
    </div>
  );
}
