import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../utils/api';
import { Plus, ListMusic, Calendar, Trash2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function SetlistList({ user }) {
  const [setlists, setSetlists] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchApi('/setlists').then(setSetlists).catch(console.error);
  }, []);

  const handleCreate = async () => {
    const name = prompt('Nombre del setlist:');
    if (!name) return;
    try {
      const data = await fetchApi('/setlists', {
        method: 'POST',
        body: JSON.stringify({ name, date: new Date().toISOString() })
      });
      setSetlists([data, ...setlists]);
    } catch (err) {
      alert(err.message);
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
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Setlists</h1>
          <p className="text-slate-400">Listas de canciones para eventos</p>
        </div>
        <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors">
          <Plus size={18} />
          <span>Nuevo Setlist</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {setlists.map(setlist => (
          <div key={setlist.id} className="relative group">
            <Link to={`/setlists/${setlist.id}`} className="block p-6 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-slate-700 group-hover:bg-slate-600 rounded-xl transition-colors">
                  <ListMusic className="text-purple-400" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold pr-8">{setlist.name}</h3>
                  <div className="flex items-center text-sm text-slate-400 mt-1">
                    <Calendar size={14} className="mr-1" />
                    {setlist.date ? new Date(setlist.date).toLocaleDateString() : 'Sin fecha'}
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                {setlist.SetlistSong?.length || 0} canciones configuradas
              </p>
            </Link>
            
            {user?.role === 'ADMIN' && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setDeletingId(setlist.id);
                }}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                title="Eliminar Setlist"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
      </div>

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
