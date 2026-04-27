import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchApi } from '../utils/api';
import { Save, ArrowLeft, GitBranch, Globe, Lock } from 'lucide-react';

export default function VariantEditor({ user }) {
  const { id } = useParams(); // songId
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  
  const [variantName, setVariantName] = useState('');
  const [rawText, setRawText] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchApi(`/songs/${id}`).then(songData => {
      setSong(songData);
      
      // Reconstruct raw text from structure to seed the editor
      if (songData.structure && songData.structure.sections) {
        const text = songData.structure.sections.map(s => {
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
      alert('Error cargando canción base: ' + err.message);
      navigate('/songs');
    });
  }, [id, navigate]);

  const handleSave = async () => {
    if (!variantName || !rawText) return alert('Nombre de la variante y letra son obligatorios');
    setLoading(true);
    try {
      await fetchApi(`/variants`, {
        method: 'POST',
        body: JSON.stringify({ 
          songId: id,
          userId: user.id,
          name: variantName, 
          rawText,
          isPublic
        })
      });
      // Redirect back to song viewer where the variant will be listed
      navigate(`/songs/${id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
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
            <div className="flex items-center gap-3 mb-2">
              <GitBranch size={24} className="text-purple-400" />
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white/60">Crear Variante</h1>
            </div>
            <p className="text-slate-400 font-medium">Basado en: {song.title} - {song.artist}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
        <div className="space-y-6">
          <div className="p-6 md:p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl space-y-6 shadow-2xl">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Nombre de Variante</label>
              <input type="text" placeholder="Ej: Acústica, Solo Voces..." value={variantName} onChange={e => setVariantName(e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-white font-medium" required />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-3">Visibilidad</label>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsPublic(false)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${!isPublic ? 'bg-purple-500/20 border-purple-500/50 text-white' : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20'}`}
                >
                  <Lock size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider">Privada</span>
                </button>
                <button 
                  onClick={() => setIsPublic(true)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${isPublic ? 'bg-purple-500/20 border-purple-500/50 text-white' : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20'}`}
                >
                  <Globe size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider">Pública</span>
                </button>
              </div>
            </div>

            <button onClick={handleSave} disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black hover:bg-slate-200 rounded-2xl font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] mt-4">
              <Save size={20} /> {loading ? 'Guardando...' : 'Crear Variante'}
            </button>
          </div>
        </div>

        <div className="relative group">
          <label className="block text-sm font-bold text-slate-400 mb-3 ml-2">Editor de Letra (Variante):</label>
          <textarea 
            value={rawText} 
            onChange={e => setRawText(e.target.value)}
            className="w-full h-[600px] p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl font-mono text-sm outline-none whitespace-pre resize-none focus:ring-2 focus:ring-purple-500/50 transition-all text-slate-300"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
