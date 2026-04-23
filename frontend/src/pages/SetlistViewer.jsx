import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchApi } from '../utils/api';
import { ArrowLeft, Music, Plus, Trash2, Edit2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import PromptModal from '../components/PromptModal';

export default function SetlistViewer({ user }) {
  const { id } = useParams();
  const [setlist, setSetlist] = useState(null);
  const [availableSongs, setAvailableSongs] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  useEffect(() => {
    fetchApi(`/setlists/${id}`).then(setSetlist).catch(console.error);
    fetchApi('/songs').then(setAvailableSongs).catch(console.error);
  }, [id]);

  const addSong = async (song) => {
    try {
      const resp = await fetchApi(`/setlists/${id}/songs`, {
        method: 'POST',
        body: JSON.stringify({
          songId: song.id,
          position: setlist.SetlistSong.length,
          selectedKey: song.originalKey
        })
      });
      // Refresh
      const updated = await fetchApi(`/setlists/${id}`);
      setSetlist(updated);
      setShowAdd(false);
    } catch (e) {
      alert(e.message);
    }
  };

  const executeRemoveSong = async () => {
    if (!songToDelete) return;
    setIsDeleting(true);
    try {
      await fetchApi(`/setlists/songs/${songToDelete.id}`, {
        method: 'DELETE'
      });
      const updated = await fetchApi(`/setlists/${id}`);
      setSetlist(updated);
      setSongToDelete(null);
    } catch (e) {
      alert(e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const updateKey = async (ssId, newKey) => {
    try {
      await fetchApi(`/setlists/songs/${ssId}`, {
        method: 'PUT',
        body: JSON.stringify({ selectedKey: newKey })
      });
      const updated = await fetchApi(`/setlists/${id}`);
      setSetlist(updated);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleRename = async (newName) => {
    setRenameLoading(true);
    try {
      await fetchApi(`/setlists/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: newName }) // it accepts {name, description, date}
      });
      const updated = await fetchApi(`/setlists/${id}`);
      setSetlist(updated);
      setIsRenaming(false);
    } catch (e) {
      alert(e.message);
    } finally {
      setRenameLoading(false);
    }
  };

  if (!setlist) return <div className="p-8">Cargando...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">{setlist.name}</h1>
              {user?.role === 'ADMIN' && (
                <button 
                  onClick={() => setIsRenaming(true)} 
                  className="p-1.5 bg-white/5 hover:bg-white/10 hover:text-blue-400 text-slate-400 rounded-lg transition-colors border border-white/5 shadow-sm"
                  title="Renombrar Setlist"
                >
                  <Edit2 size={16} />
                </button>
              )}
            </div>
            <p className="text-slate-400 font-medium">Gestión de Setlist</p>
          </div>
        </div>
      </div>

      <div className="mb-8 p-6 md:p-8 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            Repertorio 
            <span className="text-sm px-3 py-1 bg-white/10 rounded-full font-medium">{setlist.SetlistSong.length}</span>
          </h2>
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-5 py-3 bg-white text-black hover:bg-slate-200 rounded-full text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <Plus size={16} /> Agregar Canción
          </button>
        </div>

        {showAdd && (
          <div className="mb-8 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 max-h-72 overflow-y-auto custom-scrollbar relative z-10 shadow-inner">
            <div className="text-sm font-bold text-blue-400 mb-3 sticky top-0 bg-black/40 backdrop-blur-md pb-2 z-10">Selecciona una canción:</div>
            {availableSongs.map(s => (
              <button key={s.id} onClick={() => addSong(s)} className="block w-full text-left px-4 py-3 hover:bg-white/10 border border-transparent hover:border-white/5 rounded-xl mb-1 transition-colors text-white font-medium">
                {s.title} <span className="text-slate-500 font-normal opacity-70 ml-2"> {s.artist}</span>
              </button>
            ))}
          </div>
        )}

        <ul className="space-y-4 relative z-10">
          {setlist.SetlistSong.map((ss, idx) => (
            <li key={ss.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-black/40 border border-white/5 rounded-2xl group hover:border-white/10 transition-colors">
              <div className="flex items-center gap-5 mb-3 md:mb-0">
                <span className="text-slate-600 font-bold font-mono text-lg w-6 text-center">{idx + 1}</span>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                  <Music size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white mb-1 group-hover:text-blue-400 transition-colors">{ss.song.title}</h3>
                  <div className="text-sm text-slate-400 font-medium">{ss.song.artist}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 pl-14 md:pl-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Tono:</span>
                  <input 
                    type="text" 
                    value={ss.selectedKey} 
                    onChange={e => {
                        const ss_copy = [...setlist.SetlistSong];
                        ss_copy[idx].selectedKey = e.target.value;
                        setSetlist({...setlist, SetlistSong: ss_copy});
                    }}
                    onBlur={(e) => updateKey(ss.id, e.target.value)}
                    className="w-16 p-2 text-center bg-white/5 border border-white/10 rounded-lg text-sm font-bold text-white outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all font-mono"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Link 
                    to={`/songs/${ss.song.id}`} 
                    state={{ 
                      setCtx: {
                        id: setlist.id,
                        name: setlist.name,
                        songs: setlist.SetlistSong.map(s => ({
                          id: s.song.id,
                          title: s.song.title,
                          key: s.selectedKey
                        }))
                      }
                    }}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/5 rounded-xl text-sm font-bold text-white transition-all backdrop-blur-md"
                  >
                    Ver Letra
                  </Link>
                  <button onClick={() => setSongToDelete({ id: ss.id, title: ss.song.title })} title="Remover del setlist" className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl border border-red-500/20 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {setlist.SetlistSong.length === 0 && (
            <div className="text-center text-slate-400 py-8 font-medium">
              No hay canciones en este setlist. Comienza agregando una.
            </div>
          )}
        </ul>
      </div>

      <PromptModal
        isOpen={isRenaming}
        onClose={() => setIsRenaming(false)}
        onSubmit={handleRename}
        title="Renombrar Setlist"
        placeholder={setlist.name}
        submitText="Guardar Cambios"
        loading={renameLoading}
      />

      <ConfirmModal 
        isOpen={!!songToDelete} 
        onClose={() => setSongToDelete(null)} 
        onConfirm={executeRemoveSong} 
        title="Remover Canción" 
        message={`¿Estás seguro que deseas quitar "${songToDelete?.title}" de la lista? Esta acción no elimina la canción del sistema, sólo la quita de este evento.`}
        confirmText="Remover"
        loading={isDeleting} 
      />
    </div>
  );
}
