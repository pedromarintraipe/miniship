import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchApi } from '../utils/api';
import { transposeChords, transposeChordLine } from '../utils/transpose';
import { ArrowLeft, ArrowDown, ArrowUp, Maximize2, Minimize2, ChevronLeft, ChevronRight, Edit2, GitBranch, ChevronDown } from 'lucide-react';

export default function SongViewer({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [song, setSong] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [showVariantMenu, setShowVariantMenu] = useState(false);
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
      if (currentIndex !== -1 && setCtx.songs[currentIndex].key) {
        setTargetKey(setCtx.songs[currentIndex].key);
      } else {
        setTargetKey(data.originalKey);
      }
    }).catch(console.error);

    fetchApi(`/variants?songId=${id}&userId=${user.id}`).then(data => {
      setVariants(data);
      if (currentIndex !== -1 && setCtx.songs[currentIndex].variantId) {
        setSelectedVariantId(setCtx.songs[currentIndex].variantId);
      }
    }).catch(console.error);
  }, [id, currentIndex, setCtx, user.id]);

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

  const getSectionStyles = (type) => {
    const t = type.toUpperCase();
    if (t.includes('CORO') || t.includes('CHORUS')) {
      return {
        label: 'text-orange-400',
        border: 'from-orange-500 via-red-500 to-orange-500',
        bg: 'bg-orange-500/5',
        glow: 'shadow-[0_0_40px_rgba(249,115,22,0.15)]'
      };
    }
    if (t.includes('PUENTE') || t.includes('BRIDGE')) {
      return {
        label: 'text-purple-400',
        border: 'from-purple-500 via-indigo-500 to-purple-500',
        bg: 'bg-purple-500/5',
        glow: 'shadow-[0_0_40px_rgba(139,92,246,0.15)]'
      };
    }
    if (t.includes('INTRO') || t.includes('OUTRO') || t.includes('TAG')) {
      return {
        label: 'text-slate-400',
        border: 'from-slate-500 via-gray-600 to-slate-500',
        bg: 'bg-white/5',
        glow: ''
      };
    }
    return {
      label: 'text-blue-400',
      border: 'from-blue-500 via-cyan-500 to-blue-500',
      bg: 'bg-blue-500/5',
      glow: 'shadow-[0_0_40px_rgba(59,130,246,0.15)]'
    };
  };

  const renderPerfectAlignment = (line, origKey, tKey) => {
    if (!line.chordLine && !line.lyrics) return null;
    
    const transposedChordLine = line.chordLine ? transposeChordLine(String(line.chordLine), origKey, tKey) : "";
    const lyrics = line.lyrics || "";

    if (!transposedChordLine || !isMusician) {
      return (
        <div className="font-medium text-slate-100 py-1" style={{ minHeight: '1.2em' }}>
          {lyrics || '\u00A0'}
        </div>
      );
    }

    // Si no hay letra, renderizamos la línea de acordes con su espaciado original
    if (!lyrics.trim()) {
      return (
        <div className="text-blue-400 font-bold font-mono whitespace-pre py-2 brightness-125 text-[0.9em]">
          {transposedChordLine}
        </div>
      );
    }

    const regex = /([A-G][b#]?[\w/#]*)/g;
    const chordsInLine = [];
    let match;
    while ((match = regex.exec(transposedChordLine)) !== null) {
      chordsInLine.push({ chord: match[0], index: match.index });
    }

    if (chordsInLine.length === 0) {
      return <div className="font-medium text-slate-100 py-1">{lyrics || '\u00A0'}</div>;
    }

    let segments = [];
    let lastIndex = 0;

    chordsInLine.forEach((c, i) => {
      if (c.index > lastIndex) {
        segments.push({ text: lyrics.slice(lastIndex, c.index), chord: null });
      }
      let nextChordIndex = chordsInLine[i+1] ? chordsInLine[i+1].index : Math.max(lyrics.length, transposedChordLine.length);
      let part = lyrics.slice(c.index, nextChordIndex);
      segments.push({ text: part || "  ", chord: c.chord });
      lastIndex = nextChordIndex;
    });

    if (lastIndex < lyrics.length) {
      segments.push({ text: lyrics.slice(lastIndex), chord: null });
    }

    return (
      <div className="flex flex-wrap items-end gap-y-6 pt-6 pb-2">
        {segments.map((seg, idx) => (
          seg.chord ? (
            <ruby key={idx} className="relative mr-0">
              <span className="text-slate-100 whitespace-pre">{seg.text}</span>
              <rt className="absolute left-0 bottom-full mb-1 text-blue-400 font-bold font-mono text-[0.8em] tracking-tight brightness-125 whitespace-nowrap">
                {seg.chord}
              </rt>
            </ruby>
          ) : (
            <span key={idx} className="text-slate-100 whitespace-pre">{seg.text}</span>
          )
        ))}
      </div>
    );
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
              <h1 className="text-xl md:text-4xl font-extrabold tracking-tight text-white truncate">{song.title}</h1>
              <p className="text-xs md:text-base text-slate-400 font-medium truncate">{song.artist}</p>
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
            <button onClick={() => setIsFocusMode(true)} title="Modo Lectura" className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors">
              <Maximize2 size={18} />
            </button>
            {isMusician && (
              <>
                <button onClick={() => navigate(`/songs/${id}/edit`)} title="Editar Canción" className="p-1.5 hover:bg-blue-500/10 text-slate-300 hover:text-blue-400 rounded-lg transition-colors">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => navigate(`/songs/${id}/variants/new`)} title="Crear Variante" className="p-1.5 hover:bg-purple-500/10 text-slate-300 hover:text-purple-400 rounded-lg transition-colors pr-2">
                  <GitBranch size={18} />
                </button>
              </>
            )}
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
          <h2 className="text-lg md:text-2xl font-bold text-white opacity-80">{song.title}</h2>
        </div>
      )}

      {/* Select Variant Wrapper */}
      {!isFocusMode && variants.length > 0 && (
        <div className="flex justify-center -mt-6 mb-6 relative z-30">
          <div className="relative">
            <button
              onClick={() => setShowVariantMenu(!showVariantMenu)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-xl px-5 py-2.5 rounded-full flex items-center gap-3 transition-colors shadow-lg"
            >
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Versión:</span>
              <span className="text-sm font-bold text-white pr-2">
                {selectedVariantId ? variants.find(v => v.id === selectedVariantId)?.name : 'Original'}
              </span>
              <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${showVariantMenu ? 'rotate-180' : ''}`} />
            </button>

            {showVariantMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowVariantMenu(false)}></div>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-56 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <button
                    onClick={() => { setSelectedVariantId(''); setShowVariantMenu(false); }}
                    className={`w-full text-left px-5 py-3.5 text-sm font-medium transition-colors ${!selectedVariantId ? 'bg-purple-500/20 text-purple-300' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                  >
                    Original
                  </button>
                  {variants.map(v => (
                    <button
                      key={v.id}
                      onClick={() => { setSelectedVariantId(v.id); setShowVariantMenu(false); }}
                      className={`w-full text-left px-5 py-3.5 text-sm font-medium transition-colors border-t border-white/5 ${selectedVariantId === v.id ? 'bg-purple-500/20 text-purple-300' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className={`space-y-12 ${isFocusMode ? 'px-4 md:px-24 mx-auto max-w-5xl pt-4' : 'px-4'}`} style={{ fontSize: `${fontSize}px` }}>
        {(selectedVariantId ? variants.find(v => v.id === selectedVariantId)?.structure : song.structure)?.sections?.map((section, idx) => {
          const styles = getSectionStyles(section.type);
          return (
            <div key={idx} className={`relative p-8 md:p-10 rounded-[2.5rem] border border-white/10 transition-all ${styles.bg} ${styles.glow} ${isFocusMode ? 'border-transparent bg-transparent shadow-none' : ''}`}>
              <div className="flex items-center gap-3 mb-8">
                <span className={`text-[0.7rem] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full bg-white/5 border border-white/10 ${styles.label}`}>
                  {section.type}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>

              <div className="space-y-2">
                {section.lines.map((line, lIdx) => (
                  <div key={lIdx}>
                    {renderPerfectAlignment(line, song.originalKey || 'C', targetKey || song.originalKey || 'C')}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
