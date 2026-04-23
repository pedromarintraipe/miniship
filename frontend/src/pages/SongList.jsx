import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../utils/api';
import { Search, Plus, Music, Trash2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function SongList({ user }) {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchApi(`/songs${search ? `?search=${encodeURIComponent(search)}` : ''}`)
        .then(setSongs)
        .catch(console.error);
    }, 300); // 300ms debounce
    return () => clearTimeout(delay);
  }, [search]);

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await fetchApi(`/songs/${deletingId}`, { method: 'DELETE' });
      setSongs(songs.filter(s => s.id !== deletingId));
      setDeletingId(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const songToDelete = songs.find(s => s.id === deletingId);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 relative z-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-2">Repertorio</h1>
          <p className="text-slate-400 font-medium">Bases musicales y letras del ministerio</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por título o artista..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-full focus:ring-2 focus:ring-white/20 focus:border-white/30 outline-none backdrop-blur-xl transition-all text-sm font-medium placeholder:text-slate-500"
            />
          </div>
          <Link to="/songs/import" className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black hover:bg-slate-200 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
            <Plus size={18} />
            <span>Añadir Canción</span>
          </Link>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        {songs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium">
            No se encontraron canciones.
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {songs.map(song => (
              <li key={song.id} className="relative group">
                <Link to={`/songs/${song.id}`} className="flex items-center p-5 hover:bg-white/5 transition-all">
                  <div className="p-3 bg-white/5 rounded-2xl mr-5 border border-white/5 group-hover:border-white/10 transition-colors">
                    <Music size={22} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-white mb-1 group-hover:text-blue-400 transition-colors">{song.title}</h3>
                    <p className="text-sm text-slate-400 font-medium">{song.artist || 'Desconocido'} <span className="mx-2 opacity-50">•</span> Tono: <span className="text-slate-300 bg-white/10 px-2 py-0.5 rounded-md">{song.originalKey}</span></p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity mr-4 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                </Link>
                {user?.role === 'ADMIN' && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setDeletingId(song.id);
                    }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors backdrop-blur-md"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmModal 
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Eliminar Canción"
        message={`¿Estás seguro que deseas eliminar permanentemente "${songToDelete?.title}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
