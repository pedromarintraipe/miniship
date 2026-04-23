import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../utils/api';
import { Save, ArrowLeft } from 'lucide-react';

export default function SongImporter() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [originalKey, setOriginalKey] = useState('C');
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [url, setUrl] = useState('');
  const [scraping, setScraping] = useState(false);

  const handleScrape = async () => {
    if (!url) return;
    setScraping(true);
    try {
      const data = await fetchApi('/songs/scrape', {
        method: 'POST',
        body: JSON.stringify({ url })
      });
      if (data.rawText) setRawText(data.rawText);
      if (data.title) setTitle(data.title);
      if (data.artist) setArtist(data.artist);
      if (data.originalKey) setOriginalKey(data.originalKey);
    } catch (err) {
      alert(err.message);
    } finally {
      setScraping(false);
    }
  };

  const handleSave = async () => {
    if (!title || !rawText) return alert('Título y letra son obligatorios');
    setLoading(true);
    try {
      const data = await fetchApi('/songs', {
        method: 'POST',
        body: JSON.stringify({ title, artist, originalKey, rawText })
      });
      navigate(`/songs/${data.id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-2">Añadir Canción</h1>
            <p className="text-slate-400 font-medium">Extrae desde internet o pega el texto plano</p>
          </div>
        </div>
      </div>

      <div className="mb-8 p-6 md:p-8 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl relative overflow-hidden shadow-2xl">
        {/* Glow effect for scraper */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        
        <h2 className="text-sm text-blue-400 font-bold mb-4 uppercase tracking-widest relative z-10">Importación Automática (CifraClub)</h2>
        <div className="flex flex-col md:flex-row gap-4 relative z-10">
          <input 
            type="url" 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            placeholder="Pegar URL de CifraClub aquí..." 
            className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white placeholder:text-slate-500 font-medium"
          />
          <button 
            onClick={handleScrape} 
            disabled={scraping}
            className="px-8 py-4 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 hover:text-white font-bold rounded-2xl transition-all border border-blue-500/30 whitespace-nowrap shadow-[0_0_20px_rgba(59,130,246,0.1)]"
          >
            {scraping ? 'Extrayendo...' : 'Autocompletar'}
          </button>
        </div>
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
              <label className="block text-sm font-bold text-slate-300 mb-2">Tono (Ej: G, C#m)</label>
              <input type="text" value={originalKey} onChange={e => setOriginalKey(e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all text-white font-medium uppercase font-mono" />
            </div>
            <button onClick={handleSave} disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black hover:bg-slate-200 rounded-2xl font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] mt-4">
              <Save size={20} /> {loading ? 'Guardando...' : 'Guardar Canción'}
            </button>
          </div>
        </div>

        <div className="relative group">
          <label className="block text-sm font-bold text-slate-400 mb-3 ml-2">Pega la letra con acordes arriba:</label>
          <div className="absolute inset-0 top-8 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none opacity-50"></div>
          <textarea 
            value={rawText} 
            onChange={e => setRawText(e.target.value)}
            placeholder={"[Verso]\nG       D\nEstaba muerto en mi pecado"}
            className="w-full h-[600px] p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl font-mono text-sm outline-none whitespace-pre resize-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all text-slate-300"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
