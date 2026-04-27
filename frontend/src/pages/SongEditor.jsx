import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchApi } from '../utils/api';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function SongEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [originalKey, setOriginalKey] = useState('');
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchApi(`/songs/${id}`).then(song => {
      setTitle(song.title);
      setArtist(song.artist || '');
      setOriginalKey(song.originalKey);
      
      // Reconstruct raw text from structure
      if (song.structure && song.structure.sections) {
        const text = song.structure.sections.map(s => {
          const header = `[${s.type}]\n`;
          const lines = s.lines.map(l => {
            const chordPart = l.chordLine ? l.chordLine + '\n' : '';
            return chordPart + (l.lyrics || '');
          }).join('\n');
          return header + lines;
        }).join('\n\n');
        setRawText(text);
      }
      setInitialLoading(false);
    }).catch(err => {
      alert('Error cargando canción: ' + err.message);
      navigate('/songs');
    });
  }, [id, navigate]);

  const handleSave = async () => {
    if (!title || !rawText) return alert('Título y letra son obligatorios');
    setLoading(true);
    try {
      await fetchApi(`/songs/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, artist, originalKey, rawText })
      });
      navigate(`/songs/${id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetchApi(`/songs/${id}`, { method: 'DELETE' });
      navigate('/songs');
    } catch (err) {
      alert(err.message);
      setDeleting(false);
    }
  };

  if (initialLoading) return <div className="p-8 text-white">Cargando datos...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-2">Editar Canción</h1>
            <p className="text-slate-400 font-medium">{title} - {artist}</p>
          </div>
        </div>
        <button 
          onClick={() => setShowDelete(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-2xl font-bold transition-all border border-red-500/20"
        >
          <Trash2 size={18} /> Eliminar
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
        <div className="space-y-6">
          <div className="p-6 md:p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl space-y-5 shadow-2xl">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Título</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all text-white font-medium" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Artista</label>
              <input type="text" value={artist} onChange={e => setArtist(e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all text-white font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Tono Original</label>
              <input type="text" value={originalKey} onChange={e => setOriginalKey(e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all text-white font-medium uppercase font-mono" />
            </div>
            <button onClick={handleSave} disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black hover:bg-slate-200 rounded-2xl font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] mt-4">
              <Save size={20} /> {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>

        <div className="relative group">
          <label className="block text-sm font-bold text-slate-400 mb-3 ml-2">Editor de Letra (con acordes):</label>
          <textarea 
            value={rawText} 
            onChange={e => setRawText(e.target.value)}
            className="w-full h-[600px] p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl font-mono text-sm outline-none whitespace-pre resize-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all text-slate-300"
          ></textarea>
        </div>
      </div>

      <ConfirmModal 
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Eliminar Canción"
        message="¿Estás seguro de que deseas eliminar esta canción permanentemente? Esta acción no se puede deshacer."
        confirmText="Eliminar permanentemente"
        loading={deleting}
      />
    </div>
  );
}
