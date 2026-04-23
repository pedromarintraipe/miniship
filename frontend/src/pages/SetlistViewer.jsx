import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchApi } from '../utils/api';
import { ArrowLeft, Music, Plus } from 'lucide-react';

export default function SetlistViewer({ user }) {
  const { id } = useParams();
  const [setlist, setSetlist] = useState(null);
  const [availableSongs, setAvailableSongs] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

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

  if (!setlist) return <div className="p-8">Cargando...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => window.history.back()} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold">{setlist.name}</h1>
          <p className="text-slate-400">Setlist</p>
        </div>
      </div>

      <div className="mb-8 p-6 bg-slate-800 border border-slate-700 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Canciones ({setlist.SetlistSong.length})</h2>
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold">
            <Plus size={16} /> Agregar
          </button>
        </div>

        {showAdd && (
          <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700 max-h-60 overflow-y-auto">
            <div className="text-sm text-slate-400 mb-2">Selecciona una canción para agregar:</div>
            {availableSongs.map(s => (
              <button key={s.id} onClick={() => addSong(s)} className="block w-full text-left px-3 py-2 hover:bg-slate-800 rounded mb-1">
                {s.title} <span className="text-slate-500">- {s.artist}</span>
              </button>
            ))}
          </div>
        )}

        <ul className="space-y-3">
          {setlist.SetlistSong.map((ss, idx) => (
            <li key={ss.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-900/50 border border-slate-700/50 rounded-lg group">
              <div className="flex items-center gap-4 mb-3 md:mb-0">
                <span className="text-slate-500 font-mono w-6 text-center">{idx + 1}</span>
                <div className="p-2 bg-slate-700 rounded">
                  <Music size={16} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{ss.song.title}</h3>
                  <div className="text-sm text-slate-400">{ss.song.artist}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 pl-10 md:pl-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Tono:</span>
                  <input 
                    type="text" 
                    value={ss.selectedKey} 
                    onChange={e => {
                        const ss_copy = [...setlist.SetlistSong];
                        ss_copy[idx].selectedKey = e.target.value;
                        setSetlist({...setlist, SetlistSong: ss_copy});
                    }}
                    onBlur={(e) => updateKey(ss.id, e.target.value)}
                    className="w-16 p-1 text-center bg-slate-800 border border-slate-600 rounded text-sm font-bold outline-none focus:border-blue-500"
                  />
                </div>
                <Link to={`/songs/${ss.song.id}`} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-bold transition-colors">
                  Ver Canto
                </Link>
              </div>
            </li>
          ))}
          {setlist.SetlistSong.length === 0 && <div className="text-center text-slate-500 py-4">No hay canciones en este setlist.</div>}
        </ul>
      </div>
    </div>
  );
}
