function parseRawSongText(text) {
  const lines = text.split('\n').map(l => l.trimRight());
  let sections = [];
  let currentSection = { type: 'VERSE', lines: [] };
  
  // Basic chord regex: A-G, optional #/b, optional m/maj/dim/aug/sus, optional numbers, optional /bass
  const chordRegex = /^[A-G]([#b])?(m|maj|min|dim|aug|sus)?\d?(\/[A-G]([#b])?)?$/;
  
  const isChordLine = (line) => {
    if (!line.trim()) return false;
    const tokens = line.split(/\s+/).filter(Boolean);
    const chordTokens = tokens.filter(t => chordRegex.test(t));
    return chordTokens.length > 0 && (chordTokens.length / tokens.length > 0.4);
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if it's a section header like [Chorus] or Verse 1:
    if (line.match(/^\[(.*?)\]$/) || line.match(/^(Verse|Chorus|Bridge|Pre-Chorus|Intro|Outro|Tag)/i)) { 
      if (currentSection.lines.length > 0) sections.push(currentSection);
      let type = line.replace(/[\[\]\:]/g, '').trim().toUpperCase();
      currentSection = { type, lines: [] };
      continue;
    }
    
    if (isChordLine(line)) {
      // Find chords
      const chords = [];
      const regex = /([A-G][\w/#]*)/g;
      let match;
      while ((match = regex.exec(line)) !== null) {
        chords.push(match[0]);
      }
      
      let lyrics = "";
      if (i + 1 < lines.length && !isChordLine(lines[i + 1]) && lines[i + 1].trim()) {
        lyrics = lines[i + 1].trim();
        i++; // skip lyric line since we merged it with chords
      }
      
      currentSection.lines.push({ lyrics, chords, chordLine: line });
    } else if (line.trim()) {
      // Lyric line without chords
      currentSection.lines.push({ lyrics: line.trim(), chords: [], chordLine: null });
    }
  }
  
  if (currentSection.lines.length > 0) {
    sections.push(currentSection);
  }
  
  return { sections };
}
module.exports = { parseRawSongText };
