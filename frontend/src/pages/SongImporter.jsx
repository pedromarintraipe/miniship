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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Importar Canción</h1>
      </div>

      <div className="mb-6 p-6 bg-slate-800 border border-slate-700 rounded-xl">
        <h2 className="text-sm text-blue-400 font-bold mb-3 uppercase tracking-wider">Importación Automática (CifraClub)</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <input 
            type="url" 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            placeholder="Pegar URL de CifraClub aquí (Ej: https://www.cifraclub.com/...)" 
            className="flex-1 p-3 bg-slate-900 border border-slate-700 rounded outline-none focus:border-blue-500"
          />
          <button 
            onClick={handleScrape} 
            disabled={scraping}
            className="px-6 py-3 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 font-bold rounded-lg transition-colors border border-blue-500/30 whitespace-nowrap"
          >
            {scraping ? 'Cargando...' : 'Autocompletar'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-6 bg-slate-800 border border-slate-700 rounded-xl space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Título</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" required />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Artista</label>
              <input type="text" value={artist} onChange={e => setArtist(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Tono Original (Ej: G, C#m)</label>
              <input type="text" value={originalKey} onChange={e => setOriginalKey(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
            </div>
            <button onClick={handleSave} disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold">
              <Save size={18} /> {loading ? 'Guardando...' : 'Guardar y Procesar'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Pega la letra con acordes arriba:</label>
          <textarea 
            value={rawText} 
            onChange={e => setRawText(e.target.value)}
            placeholder={"[Verso]\nG       D\nEstaba muerto en mi pecado"}
            className="w-full h-[500px] p-4 bg-slate-800 border border-slate-700 rounded-xl font-mono text-sm outline-none whitespace-pre resize-none focus:border-blue-500"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
