import { useState, useEffect } from 'react';
import { PlusCircle, X } from 'lucide-react';

export default function PromptModal({ isOpen, onClose, onSubmit, title, placeholder = "Ingresar valor...", submitText = "Aceptar", loading = false }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setValue('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <form onSubmit={handleSubmit}>
          <div className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-blue-500/20 rounded-2xl flex-shrink-0 border border-blue-500/30">
                <PlusCircle className="text-blue-400" size={28} />
              </div>
              <div className="flex-1 mt-1 w-full">
                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <input
                  type="text"
                  autoFocus
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={placeholder}
                  className="w-full mt-4 p-4 bg-black/40 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white placeholder:text-slate-500 font-medium"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md p-5 flex gap-3 justify-end border-t border-white/10">
            <button 
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl font-bold transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading || !value.trim()}
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold shadow-[0_4px_20px_rgba(59,130,246,0.3)] disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
