import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../utils/api';
import { Plus, ListMusic, Calendar, Trash2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import PromptModal from '../components/PromptModal';

export default function SetlistList({ user }) {
  const [setlists, setSetlists] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchApi('/setlists').then(setSetlists).catch(console.error);
  }, []);

  const handleCreate = async (name) => {
    setIsCreating(true);
    try {
      const data = await fetchApi('/setlists', {
        method: 'POST',
        body: JSON.stringify({ name, date: new Date().toISOString() })
      });
      setSetlists([data, ...setlists]);
      setIsCreatingModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await fetchApi(`/setlists/${deletingId}`, { method: 'DELETE' });
      setSetlists(setlists.filter(s => s.id !== deletingId));
      setDeletingId(null);
    } catch (err) {
      alert("Error eliminando setlist: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const setlistToDelete = setlists.find(s => s.id === deletingId);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 relative z-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-2">Setlists</h1>
          <p className="text-slate-400 font-medium">Planificación y listas para eventos</p>
        </div>
        
        <button onClick={() => setIsCreatingModalOpen(true)} className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black hover:bg-slate-200 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
          <Plus size={18} />
          <span>Añadir Setlist</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {setlists.map(setlist => (
          <div key={setlist.id} className="relative group">
            <Link to={`/setlists/${setlist.id}`} className="block h-full p-6 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all overflow-hidden relative">
              
              {/* Subtle glowing effect behind the card */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white">
                  <ListMusic size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white truncate pr-6">{setlist.name}</h3>
                  <div className="flex items-center text-sm text-slate-400 mt-1 font-medium">
                    <Calendar size={14} className="mr-1.5" />
                    {setlist.date ? new Date(setlist.date).toLocaleDateString() : 'Sin fecha'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  {setlist.SetlistSong?.length || 0} canciones
                </span>
                
                <div className="text-slate-500 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </div>
            </Link>
            
            {user?.role === 'ADMIN' && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setDeletingId(setlist.id);
                }}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all backdrop-blur-md z-10"
                title="Eliminar Setlist"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      <PromptModal
        isOpen={isCreatingModalOpen}
        onClose={() => setIsCreatingModalOpen(false)}
        onSubmit={handleCreate}
        title="Crear Nuevo Setlist"
        placeholder="Ej: Culto Domingo Mañana"
        submitText="Crear Setlist"
        loading={isCreating}
      />

      <ConfirmModal 
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Eliminar Setlist"
        message={`¿Estás seguro que deseas eliminar permanentemente el setlist "${setlistToDelete?.name}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
