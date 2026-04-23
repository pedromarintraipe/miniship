import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApi } from '../utils/api';
import { transposeChords, transposeChordLine } from '../utils/transpose';
import { ArrowLeft, Settings, ArrowDown, ArrowUp } from 'lucide-react';

export default function SongViewer({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [targetKey, setTargetKey] = useState('');
  const [fontSize, setFontSize] = useState(user.fontSize || 16);

  useEffect(() => {
    fetchApi(`/songs/${id}`).then(data => {
      setSong(data);
      setTargetKey(data.originalKey);
    }).catch(console.error);
  }, [id]);

  if (!song) return <div className="p-8">Cargando...</div>;

  const isMusician = user.role === 'MUSICIAN' || user.role === 'ADMIN';
  const SCALE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  const handleTranspose = (dir) => {
    const idx = SCALE.indexOf(targetKey.replace(/b/g, '#'));
    if (idx === -1) return;
    let nextIdx = (idx + dir) % 12;
    if (nextIdx < 0) nextIdx += 12;
    setTargetKey(SCALE[nextIdx]);
  };

  return (
    <div className="max-w-4xl mx-auto pb-32">
      <div className="sticky top-20 bg-black/60 backdrop-blur-3xl pb-4 pt-4 border-b border-white/5 mb-10 z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-b-3xl">
        <div className="flex items-center gap-4 px-4">
          <button onClick={() => navigate(-1)} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">{song.title}</h1>
            <p className="text-slate-400 font-medium">{song.artist}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2 rounded-2xl mx-4">
          {isMusician && (
            <>
              <span className="text-sm text-slate-300 mr-2 font-bold pl-2">Tono: <span className="text-white">{targetKey}</span></span>
              <button onClick={() => handleTranspose(-1)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"><ArrowDown size={18} /></button>
              <button onClick={() => handleTranspose(1)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"><ArrowUp size={18} /></button>
            </>
          )}
          <div className="w-px h-6 bg-white/10 mx-2"></div>
          <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className="p-1.5 hover:bg-white/10 rounded-lg text-sm font-bold text-slate-300 hover:text-white transition-colors">A-</button>
          <button onClick={() => setFontSize(f => Math.min(32, f + 2))} className="p-1.5 hover:bg-white/10 rounded-lg text-sm font-bold text-slate-300 hover:text-white transition-colors pr-2">A+</button>
        </div>
      </div>

      <div className="space-y-8 px-4" style={{ fontSize: `${fontSize}px` }}>
        {song.structure?.sections?.map((section, idx) => (
          <div key={idx} className="bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden backdrop-blur-xl shadow-2xl">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-indigo-500"></div>
            <h3 className="text-blue-400 font-bold tracking-widest mb-6 opacity-80" style={{ fontSize: '0.85rem' }}>[{section.type}]</h3>
            <div className="space-y-4">
              {section.lines.map((line, lIdx) => {
                let transposedContent = null;
                try {
                  const origKey = song.originalKey || 'C';
                  const tKey = targetKey || origKey;
                  
                  if (line.chordLine) {
                    const tString = transposeChordLine(String(line.chordLine), origKey, tKey);
                    transposedContent = (
                      <div className="text-blue-400 font-bold mb-1 font-mono whitespace-pre overflow-x-auto" style={{ fontSize: '0.85em' }}>
                        {tString}
                      </div>
                    );
                  } else {
                    const tArray = tKey ? transposeChords(line.chords || [], origKey, tKey) : (line.chords || []);
                    if (tArray && tArray.length > 0) {
                      transposedContent = (
                        <div className="text-blue-400 font-bold mb-1 font-mono whitespace-pre overflow-x-auto" style={{ fontSize: '0.85em' }}>
                          {tArray.join('    ')}
                        </div>
                      );
                    }
                  }
                } catch (e) {
                   console.error("Render error on line", line, e);
                }

                return (
                  <div key={lIdx} className="leading-tight">
                    {isMusician && transposedContent}
                    <div className="font-medium text-slate-200" style={{ minHeight: '1.5em' }}>
                      {line.lyrics || '\u00A0'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
