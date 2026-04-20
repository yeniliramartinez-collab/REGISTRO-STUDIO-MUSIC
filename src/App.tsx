import React, { useState } from "react";
import ArkheStudio from "./ui/ArkheStudio";
import VaultView from "./ui/VaultView";

export default function App() {
  const [currentView, setCurrentView] = useState<'studio' | 'vault'>('studio');

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <nav className="border-b border-zinc-200 px-8 py-4 flex gap-4">
        <button 
          onClick={() => setCurrentView('studio')}
          className={`font-medium text-sm px-4 py-2 rounded-full transition-colors ${currentView === 'studio' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}
        >
          Studio
        </button>
        <button 
          onClick={() => setCurrentView('vault')}
          className={`font-medium text-sm px-4 py-2 rounded-full transition-colors ${currentView === 'vault' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}
        >
          Content Vault & Strategist
        </button>
      </nav>

      <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
        {currentView === 'studio' ? <ArkheStudio /> : <VaultView />}
      </main>
    </div>
  );
}
