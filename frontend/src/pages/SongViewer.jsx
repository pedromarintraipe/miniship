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
    <div className="max-w-4xl mx-auto pb-24">
      <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md pb-4 pt-2 border-b border-slate-700 mb-8 z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{song.title}</h1>
            <p className="text-slate-400">{song.artist}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg">
          {isMusician && (
            <>
              <span className="text-sm text-slate-400 mr-2 font-bold">Tono: {targetKey}</span>
              <button onClick={() => handleTranspose(-1)} className="p-1 hover:bg-slate-700 rounded"><ArrowDown size={18} /></button>
              <button onClick={() => handleTranspose(1)} className="p-1 hover:bg-slate-700 rounded"><ArrowUp size={18} /></button>
            </>
          )}
          <div className="w-px h-6 bg-slate-700 mx-2"></div>
          <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className="p-1 hover:bg-slate-700 rounded text-sm font-bold">A-</button>
          <button onClick={() => setFontSize(f => Math.min(32, f + 2))} className="p-1 hover:bg-slate-700 rounded text-sm font-bold">A+</button>
        </div>
      </div>

      <div className="space-y-8" style={{ fontSize: `${fontSize}px` }}>
        {song.structure?.sections?.map((section, idx) => (
          <div key={idx} className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50"></div>
            <h3 className="text-blue-400 font-bold text-sm tracking-widest mb-4">[{section.type}]</h3>
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
