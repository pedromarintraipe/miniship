import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchApi } from '../utils/api';
import { transposeChords, transposeChordLine } from '../utils/transpose';
import { ArrowLeft, ArrowDown, ArrowUp, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SongViewer({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [song, setSong] = useState(null);
  const [targetKey, setTargetKey] = useState('');
  const [fontSize, setFontSize] = useState(user.fontSize || 16);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const setCtx = location.state?.setCtx;
  const currentIndex = setCtx ? setCtx.songs.findIndex(s => String(s.id) === String(id)) : -1;
  const prevSong = currentIndex > 0 ? setCtx.songs[currentIndex - 1] : null;
  const nextSong = currentIndex >= 0 && currentIndex < setCtx.songs.length - 1 ? setCtx.songs[currentIndex + 1] : null;

  useEffect(() => {
    fetchApi(`/songs/${id}`).then(data => {
      setSong(data);
      // Initialize with setlist's selected key if coming from there, otherwise originalKey
      if (currentIndex !== -1 && setCtx.songs[currentIndex].key) {
        setTargetKey(setCtx.songs[currentIndex].key);
      } else {
        setTargetKey(data.originalKey);
      }
    }).catch(console.error);
  }, [id, currentIndex, setCtx]);

  if (!song) return <div className="p-8 text-white">Cargando...</div>;

  const isMusician = user.role === 'MUSICIAN' || user.role === 'ADMIN';
  const SCALE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const FLAT_TO_SHARP = { "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#", "Bb": "A#" };

  const handleTranspose = (dir) => {
    if (!targetKey) return;
    const match = targetKey.match(/^([A-G][b#]?)(.*)$/);
    if (!match) return;
    
    let baseNote = match[1];
    const suffix = match[2] || '';
    
    if (FLAT_TO_SHARP[baseNote]) {
      baseNote = FLAT_TO_SHARP[baseNote];
    }
    
    const idx = SCALE.indexOf(baseNote);
    if (idx === -1) return;
    
    let nextIdx = (idx + dir) % 12;
    if (nextIdx < 0) nextIdx += 12;
    setTargetKey(SCALE[nextIdx] + suffix);
  };

  const wrapperClasses = isFocusMode
    ? "fixed inset-0 z-[100] bg-[#030303] overflow-y-auto pb-32"
    : "max-w-4xl mx-auto pb-32 relative";

  const handleNavigateSetlist = (targetId) => {
    navigate(`/songs/${targetId}`, { state: { setCtx }, replace: true });
  };

  return (
    <div className={wrapperClasses}>
      {isFocusMode && (
        <div className="ambient-bg"></div>
      )}

      {/* Setlist Navigation Buttons */}
      {prevSong && (
        <button 
          onClick={() => handleNavigateSetlist(prevSong.id)}
          title={`Anterior: ${prevSong.title}`}
          className="fixed left-2 top-1/2 -translate-y-1/2 z-50 p-3 md:p-4 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-slate-400 hover:text-white transition-all shadow-xl group hidden sm:block"
        >
          <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      )}
      
      {nextSong && (
        <button 
          onClick={() => handleNavigateSetlist(nextSong.id)}
          title={`Siguiente: ${nextSong.title}`}
          className="fixed right-2 top-1/2 -translate-y-1/2 z-50 p-3 md:p-4 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-slate-400 hover:text-white transition-all shadow-xl group hidden sm:block"
        >
          <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}

      {/* Header Panel */}
      {!isFocusMode ? (
        <div className="sticky top-20 bg-black/60 backdrop-blur-3xl pb-4 pt-4 border-b border-white/5 mb-10 z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-b-3xl">
          <div className="flex items-center gap-4 px-4 w-full md:w-auto overflow-hidden">
            <button onClick={() => navigate(-1)} className="p-3 shrink-0 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <ArrowLeft size={20} className="text-white" />
            </button>
            <div className="truncate">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white truncate">{song.title}</h1>
              <p className="text-slate-400 font-medium truncate">{song.artist}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 bg-white/5 border border-white/10 p-2 rounded-2xl mx-4">
            {isMusician && (
              <>
                <span className="text-sm text-slate-300 mr-2 font-bold pl-2 hidden lg:inline">Tono: <span className="text-white">{targetKey}</span></span>
                <button onClick={() => handleTranspose(-1)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"><ArrowDown size={18} /></button>
                <div className="text-xs font-bold text-white w-6 text-center lg:hidden">{targetKey}</div>
                <button onClick={() => handleTranspose(1)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"><ArrowUp size={18} /></button>
                <div className="w-px h-6 bg-white/10 mx-1 md:mx-2"></div>
              </>
            )}
            
            {/* Setlist Mobile Navigation */}
            {(prevSong || nextSong) && (
              <>
                <button onClick={() => prevSong && handleNavigateSetlist(prevSong.id)} disabled={!prevSong} className={`p-1.5 rounded-lg transition-colors ${prevSong ? 'text-blue-400 hover:bg-white/10 hover:text-blue-300' : 'text-slate-600'}`}><ChevronLeft size={20} /></button>
                <span className="text-xs font-bold text-slate-400">{currentIndex + 1}/{setCtx.songs.length}</span>
                <button onClick={() => nextSong && handleNavigateSetlist(nextSong.id)} disabled={!nextSong} className={`p-1.5 rounded-lg transition-colors ${nextSong ? 'text-blue-400 hover:bg-white/10 hover:text-blue-300' : 'text-slate-600'}`}><ChevronRight size={20} /></button>
                <div className="w-px h-6 bg-white/10 mx-1 md:mx-2"></div>
              </>
            )}

            <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className="p-1.5 hover:bg-white/10 rounded-lg text-sm font-bold text-slate-300 hover:text-white transition-colors">A-</button>
            <button onClick={() => setFontSize(f => Math.min(32, f + 2))} className="p-1.5 hover:bg-white/10 rounded-lg text-sm font-bold text-slate-300 hover:text-white transition-colors">A+</button>
            <div className="w-px h-6 bg-white/10 mx-1 md:mx-2"></div>
            <button onClick={() => setIsFocusMode(true)} title="Modo Lectura" className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors pr-2">
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      ) : (
        /* Focus Mode Floating Controls */
        <div className="fixed bottom-6 w-[90%] md:w-auto left-1/2 -translate-x-1/2 bg-white/5 border border-white/10 backdrop-blur-3xl p-2 rounded-2xl flex items-center justify-center gap-1 md:gap-2 z-50 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          {isMusician && (
            <>
              <span className="text-sm text-slate-300 mr-1 font-bold pl-2 hidden md:inline">{targetKey}</span>
              <button onClick={() => handleTranspose(-1)} className="p-2 hover:bg-white/10 rounded-xl text-white transition-colors"><ArrowDown size={18} /></button>
              <div className="text-sm font-bold text-white w-6 text-center md:hidden">{targetKey}</div>
              <button onClick={() => handleTranspose(1)} className="p-2 hover:bg-white/10 rounded-xl text-white transition-colors"><ArrowUp size={18} /></button>
              <div className="w-px h-6 bg-white/10 mx-1 md:mx-2"></div>
            </>
          )}

          {/* Focus Mode Setlist Mobile Navigation */}
          {(prevSong || nextSong) && (
            <>
              <button onClick={() => prevSong && handleNavigateSetlist(prevSong.id)} disabled={!prevSong} className={`p-2 rounded-xl transition-colors ${prevSong ? 'text-blue-400 hover:bg-white/10 hover:text-blue-300' : 'text-slate-600'}`}><ChevronLeft size={20} /></button>
              <button onClick={() => nextSong && handleNavigateSetlist(nextSong.id)} disabled={!nextSong} className={`p-2 rounded-xl transition-colors ${nextSong ? 'text-blue-400 hover:bg-white/10 hover:text-blue-300' : 'text-slate-600'}`}><ChevronRight size={20} /></button>
              <div className="w-px h-6 bg-white/10 mx-1 md:mx-2"></div>
            </>
          )}

          <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className="p-2 hover:bg-white/10 rounded-xl text-sm font-bold text-white transition-colors">A-</button>
          <button onClick={() => setFontSize(f => Math.min(32, f + 2))} className="p-2 hover:bg-white/10 rounded-xl text-sm font-bold text-white transition-colors">A+</button>
          <div className="w-px h-6 bg-white/10 mx-1 md:mx-2"></div>
          <button onClick={() => setIsFocusMode(false)} title="Salir de Modo Lectura" className="p-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-colors">
            <Minimize2 size={18} />
          </button>
        </div>
      )}

      {isFocusMode && (
        <div className="sticky top-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent z-10 text-center pointer-events-none mb-4">
          <h2 className="text-2xl font-bold text-white opacity-80">{song.title}</h2>
        </div>
      )}

      <div className={`space-y-8 ${isFocusMode ? 'px-4 md:px-24 mx-auto max-w-5xl pt-4' : 'px-4'}`} style={{ fontSize: `${fontSize}px` }}>
        {song.structure?.sections?.map((section, idx) => (
          <div key={idx} className={`bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden backdrop-blur-xl shadow-2xl group transition-all hover:bg-white/10 hover:border-white/20 ${isFocusMode ? 'border-transparent bg-transparent shadow-none hover:bg-transparent' : ''}`}>
            {/* Vibrant floating glow for sections */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-orange-400 via-purple-400 to-blue-500 opacity-80"></div>
            
            <h3 className="text-orange-400 font-extrabold tracking-widest mb-6 uppercase" style={{ fontSize: '0.85rem' }}>[{section.type}]</h3>
            <div className="space-y-4">
              {section.lines.map((line, lIdx) => {
                let transposedContent = null;
                try {
                  const origKey = song.originalKey || 'C';
                  const tKey = targetKey || origKey;
                  
                  if (line.chordLine) {
                    const tString = transposeChordLine(String(line.chordLine), origKey, tKey);
                    transposedContent = (
                      <div className="text-blue-400 font-bold mb-1 font-mono whitespace-pre overflow-x-auto brightness-125" style={{ fontSize: '0.85em' }}>
                        {tString}
                      </div>
                    );
                  } else {
                    const tArray = tKey ? transposeChords(line.chords || [], origKey, tKey) : (line.chords || []);
                    if (tArray && tArray.length > 0) {
                      transposedContent = (
                        <div className="text-blue-400 font-bold mb-1 font-mono whitespace-pre overflow-x-auto brightness-125" style={{ fontSize: '0.85em' }}>
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
                    <div className="font-medium text-slate-100" style={{ minHeight: '1.5em' }}>
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
