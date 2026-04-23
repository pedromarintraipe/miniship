import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Eliminar", loading = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-red-500/20 rounded-2xl flex-shrink-0 border border-red-500/30">
              <AlertTriangle className="text-red-400" size={28} />
            </div>
            <div className="flex-1 mt-1">
              <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
              <p className="text-slate-300 font-medium leading-relaxed text-sm">
                {message}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-md p-5 flex gap-3 justify-end border-t border-white/10">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl font-bold transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-[0_4px_20px_rgba(239,68,68,0.3)] transition-all flex items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
