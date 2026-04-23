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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Canciones</h1>
          <p className="text-slate-400">Repertorio completo del ministerio</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar canción o artista..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <Link to="/songs/import" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors">
            <Plus size={18} />
            <span className="hidden sm:inline">Nueva Canción</span>
          </Link>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {songs.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No se encontraron canciones.
          </div>
        ) : (
          <ul className="divide-y divide-slate-700">
            {songs.map(song => (
              <li key={song.id} className="relative group">
                <Link to={`/songs/${song.id}`} className="flex items-center p-4 hover:bg-slate-700/50 transition-colors">
                  <div className="p-3 bg-slate-700 rounded-lg mr-4">
                    <Music size={20} className="text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{song.title}</h3>
                    <p className="text-sm text-slate-400">{song.artist || 'Desconocido'} • Tono: {song.originalKey}</p>
                  </div>
                </Link>
                {user?.role === 'ADMIN' && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setDeletingId(song.id);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
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
