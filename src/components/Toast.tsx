import { Check } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  title: string;
  message: string;
  isError?: boolean;
  onClose: () => void;
}

export default function Toast({ title, message, isError = false, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-10 right-10 glass px-6 py-4 rounded-2xl border-emerald-500/50 flex items-center gap-3 transition-all duration-500 z-50 animate-in slide-in-from-bottom-5 fade-in ${isError ? 'border-rose-500/50' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${isError ? 'bg-rose-500' : 'bg-emerald-500'}`}>
        <Check className="w-4 h-4" />
      </div>
      <div>
        <p className="font-bold text-sm">{title}</p>
        <p className="text-xs text-slate-400">{message}</p>
      </div>
    </div>
  );
}
