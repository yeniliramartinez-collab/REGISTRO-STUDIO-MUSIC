import React, { useState } from "react";
import ArkheStudio from "./ui/ArkheStudio";
import VaultView from "./ui/VaultView";
import MarketplaceView from "./ui/MarketplaceView";

export default function App() {
  const [currentView, setCurrentView] = useState<'studio' | 'vault' | 'marketplace'>('studio');

  return (
    <div className="min-h-screen bg-[#050505] text-[#c0c0c0] flex flex-col font-sans">
      <nav className="border-b border-[#2B0011] px-8 py-4 flex gap-4 bg-[#0a0a0c] shadow-[0_0_20px_rgba(75,0,33,0.8)] z-50 relative">
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50"></div>
        <button 
          onClick={() => setCurrentView('studio')}
          className={`font-bold text-sm px-6 py-2 rounded-lg transition-all duration-300 uppercase tracking-wider ${currentView === 'studio' ? 'bg-[#4b0021] text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.4)] border border-[#d4af37]/50' : 'text-zinc-500 hover:text-[#d4af37] hover:bg-[#1a1a24]'}`}
        >
          Studio
        </button>
        <button 
          onClick={() => setCurrentView('vault')}
          className={`font-bold text-sm px-6 py-2 rounded-lg transition-all duration-300 uppercase tracking-wider ${currentView === 'vault' ? 'bg-[#4b0021] text-[#00ffa6] shadow-[0_0_15px_rgba(0,255,166,0.4)] border border-[#00ffa6]/50' : 'text-zinc-500 hover:text-[#00ffa6] hover:bg-[#1a1a24]'}`}
        >
          Vault & Strategist
        </button>
        <button 
          onClick={() => setCurrentView('marketplace')}
          className={`font-bold text-sm px-6 py-2 rounded-lg transition-all duration-300 uppercase tracking-wider ${currentView === 'marketplace' ? 'bg-[#050505] text-[#d4af37] border border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.6)]' : 'text-zinc-500 hover:text-[#d4af37] hover:bg-[#1a1a24]'}`}
        >
          Marketplace (God Tier)
        </button>
      </nav>

      <main className="flex-1 w-full flex flex-col">
        {currentView === 'studio' && (
          <div className="p-8 max-w-4xl mx-auto w-full"><ArkheStudio /></div>
        )}
        {currentView === 'vault' && (
           <div className="p-8 max-w-4xl mx-auto w-full"><VaultView /></div>
        )}
        {currentView === 'marketplace' && (
          <MarketplaceView />
        )}
      </main>
    </div>
  );
}
