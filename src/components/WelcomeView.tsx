import { Mic, ListMusic, Settings } from 'lucide-react';
import { ViewType } from '../types';

interface WelcomeViewProps {
  onStart: () => void;
}

export default function WelcomeView({ onStart }: WelcomeViewProps) {
  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center text-white p-6"
      style={{ background: 'linear-gradient(to bottom, #1a1a1a, #2c003e)' }}
    >
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto gap-12 md:gap-24 hero">
        
        {/* Left Icons (Desktop) / Top Icons (Mobile) */}
        <div className="hidden md:flex flex-col gap-12">
          <button className="group transition-colors">
            <Mic className="w-8 h-8 text-white group-hover:text-[#9B59B6] transition-colors" />
          </button>
          <button className="group transition-colors">
            <ListMusic className="w-8 h-8 text-white group-hover:text-[#9B59B6] transition-colors" />
          </button>
        </div>

        {/* Center Content */}
        <div className="flex flex-col items-center text-center flex-1">
          <div className="mb-12">
            <h1 
              className="text-white drop-shadow-lg"
              style={{ 
                fontFamily: "'Montserrat', sans-serif", 
                fontWeight: 900, 
                fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                lineHeight: 1.1,
                marginBottom: '0.5rem'
              }}
            >
              Register Studio
            </h1>
            <h2 
              className="text-gray-300 tracking-[0.2em] uppercase"
              style={{ 
                fontFamily: "'Montserrat', sans-serif", 
                fontWeight: 300,
                fontSize: 'clamp(0.875rem, 2vw, 1.25rem)'
              }}
            >
              Music Pro V2.0
            </h2>
          </div>

          <div className="w-full md:w-auto">
            <button 
              onClick={onStart}
              className="w-full md:w-auto transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-[0_0_30px_rgba(155,89,182,0.8)]"
              style={{ 
                background: '#9B59B6', 
                border: 'none', 
                padding: '1.5rem 4rem', 
                borderRadius: '50px',
                color: 'white',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Iniciar
            </button>
          </div>
        </div>

        {/* Right Icons (Desktop) / Bottom Icons (Mobile) */}
        <div className="hidden md:flex flex-col gap-12">
          <button className="group transition-colors">
            <Settings className="w-8 h-8 text-white group-hover:text-[#9B59B6] transition-colors" />
          </button>
        </div>

        {/* Mobile Icons (Only visible on small screens) */}
        <div className="flex md:hidden items-center justify-center gap-12 mt-8">
          <button className="group transition-colors">
            <Mic className="w-8 h-8 text-white group-hover:text-[#9B59B6] transition-colors" />
          </button>
          <button className="group transition-colors">
            <ListMusic className="w-8 h-8 text-white group-hover:text-[#9B59B6] transition-colors" />
          </button>
          <button className="group transition-colors">
            <Settings className="w-8 h-8 text-white group-hover:text-[#9B59B6] transition-colors" />
          </button>
        </div>

      </div>
    </div>
  );
}
