import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, ShoppingCart, Info, Star } from "lucide-react";

interface Asset {
  id: string;
  title: string;
  creator: string;
  price: string;
  demoUrl: string;
  coverImage: string;
}

const mockAssets: Asset[] = [
  {
    id: "a1",
    title: "Cybernetic Overture",
    creator: "Vektor",
    price: "$299",
    demoUrl: "https://actions.google.com/sounds/v1/science_fiction/alien_breath.ogg",
    coverImage: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "a2",
    title: "Synthwave Aftermath",
    creator: "Neon Void",
    price: "$450",
    demoUrl: "https://actions.google.com/sounds/v1/science_fiction/cylon_scanner.ogg",
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "a3",
    title: "Digital Awakening",
    creator: "Zero Day",
    price: "$180",
    demoUrl: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
  }
];

export default function MarketplaceView() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    return () => {
      // Cleanup all audio
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  const togglePlay = (id: string, url: string) => {
    if (playingId === id) {
      // Pause
      if (audioRefs.current[id]) {
        audioRefs.current[id].pause();
      }
      setPlayingId(null);
    } else {
      // Pause previous playing
      if (playingId && audioRefs.current[playingId]) {
        audioRefs.current[playingId].pause();
      }
      // Play new
      if (!audioRefs.current[id]) {
        audioRefs.current[id] = new Audio(url);
        audioRefs.current[id].addEventListener('ended', () => {
          setPlayingId(null);
        });
      }
      audioRefs.current[id].play();
      setPlayingId(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] p-8 font-sans border-t-4 border-[#00ffa6] shadow-[inset_0px_20px_50px_-20px_rgba(0,255,166,0.3)] relative overflow-hidden">
      {/* Background Parallax Layer */}
      <div className="fixed inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 bg-fixed"></div>
      
      <div className="relative z-10">
        {/* Hero Header */}
        <div className="relative mb-16 rounded-3xl overflow-hidden border border-zinc-800 shadow-[0_0_50px_rgba(75,0,33,0.6)]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4b0021] via-[#1a0a14] to-[#050505] opacity-80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30 bg-fixed"></div>
          
          <div className="relative z-10 p-12 lg:p-20 flex flex-col items-center text-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent shadow-[0_0_20px_#d4af37]"></div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#c0c0c0] via-white to-[#d4af37] tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] mb-4">
              Intellectual Property Marketplace
            </h1>
            <p className="text-[#c0c0c0] text-lg lg:text-xl max-w-2xl mx-auto font-medium tracking-wide">
              Acquire premium sonic assets and legal IP. Level up your productions in a verified blockchain-like ecosystem.
            </p>
            
            <div className="mt-8 flex gap-4">
              <button className="px-8 py-3 bg-transparent border border-[#00ffa6] text-[#00ffa6] font-bold rounded-lg uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,166,0.5)] hover:shadow-[0_0_25px_rgba(0,255,166,0.8)] hover:bg-[#00ffa6]/10 transition-all duration-300 backdrop-blur-sm">
                Explore Drops
              </button>
              <button className="px-8 py-3 bg-transparent border border-[#d4af37] text-[#d4af37] font-bold rounded-lg uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(212,175,55,0.7)] hover:bg-[#d4af37]/10 transition-all duration-300 backdrop-blur-sm flex items-center gap-2">
                <Star className="w-5 h-5" /> Elite Tier
              </button>
            </div>
          </div>
        </div>

        {/* Grid of assets */}
        <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-[#00ffa6] pl-4 uppercase tracking-wider shadow-[-10px_0_15px_-5px_#00ffa6]">
          Latest Minted IP
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockAssets.map((asset) => (
            <div 
              key={asset.id} 
              className="group relative bg-[#0a0a0c]/80 backdrop-blur-md rounded-2xl border border-[#2a2a35] overflow-hidden hover:border-[#d4af37] transition-all duration-500 hover:shadow-[0_15px_40px_rgba(212,175,55,0.25)] hover:-translate-y-2 flex flex-col cursor-pointer"
            >
            {/* Visual Header */}
            <div className="relative h-64 overflow-hidden">
              <img 
                src={asset.coverImage} 
                alt={asset.title} 
                className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-70 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent"></div>
              
              {/* Play/Pause Float Button */}
              <button 
                onClick={() => togglePlay(asset.id, asset.demoUrl)}
                className={`absolute bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${playingId === asset.id ? 'bg-[#00ffa6] shadow-[0_0_25px_rgba(0,255,166,0.8)] border-none' : 'bg-[#4b0021] border border-[#d4af37] shadow-[0_0_15px_rgba(75,0,33,0.8)] group-hover:scale-110'}`}
              >
                {playingId === asset.id ? (
                  <Pause className="w-6 h-6 text-black" fill="currentColor" />
                ) : (
                  <Play className="w-6 h-6 text-[#d4af37] ml-1" fill="currentColor" />
                )}
              </button>

              {/* Spectral indicator when playing */}
              {playingId === asset.id && (
                <div className="absolute top-4 right-4 flex gap-1 items-end h-4">
                   <div className="w-1 bg-[#00ffa6] animate-[bounce_0.8s_infinite] h-full shadow-[0_0_5px_#00ffa6]"></div>
                   <div className="w-1 bg-[#00ffa6] animate-[bounce_0.8s_infinite_0.2s] h-1/2 shadow-[0_0_5px_#00ffa6]"></div>
                   <div className="w-1 bg-[#00ffa6] animate-[bounce_0.8s_infinite_0.4s] h-3/4 shadow-[0_0_5px_#00ffa6]"></div>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between relative z-10 border-t border-[#1a1a24]">
              {/* Title & Price */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#d4af37] mb-1 font-semibold flex items-center gap-1">
                    Verified IP
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#c0c0c0] transition-colors line-clamp-1">{asset.title}</h3>
                  <p className="text-zinc-500 text-sm mt-1">{asset.creator}</p>
                </div>
                <div className="text-xl font-mono text-[#00ffa6] font-bold drop-shadow-[0_0_8px_rgba(0,255,166,0.4)]">
                  {asset.price}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button className="flex-1 bg-[#4b0021] hover:bg-[#6b0231] border border-[#d4af37]/30 text-[#d4af37] font-bold py-2.5 rounded hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-wider">
                  <ShoppingCart className="w-4 h-4" /> Acquire
                </button>
                <button className="px-4 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded hover:bg-zinc-800 transition-colors flex items-center justify-center group-hover:border-[#c0c0c0]/50">
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}
