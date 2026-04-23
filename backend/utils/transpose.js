const SCALE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_TO_SHARP = {
  "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#", "Bb": "A#"
};

function normalizeNote(note) {
  return FLAT_TO_SHARP[note] || note;
}

function getNoteIndex(note) {
  return SCALE.indexOf(normalizeNote(note));
}

function transposeChords(chords, originalKey, targetKey) {
  if (!originalKey || !targetKey || originalKey === targetKey) return chords;

  const origIndex = getNoteIndex(originalKey);
  const targetIndex = getNoteIndex(targetKey);
  if (origIndex === -1 || targetIndex === -1) return chords;

  let delta = targetIndex - origIndex;
  // keep positive delta
  if (delta < 0) delta += 12;

  // Handles transposing flat/sharp chords and slash chords accurately based on root transposition
  return chords.map(chord => {
    return chord.replace(/([A-G][b#]?)/g, (match) => {
        const idx = getNoteIndex(match);
        if (idx === -1) return match;
        const newIdx = (idx + delta) % 12;
        return SCALE[newIdx];
    });
  });
}

function transposeSongStructure(structure, originalKey, targetKey) {
  if (!structure || !structure.sections) return structure;
  
  const transposedSections = structure.sections.map(section => {
    return {
      ...section,
      lines: section.lines.map(line => ({
        ...line,
        chords: transposeChords(line.chords || [], originalKey, targetKey)
      }))
    }
  });

  return { sections: transposedSections };
}

module.exports = { transposeChords, transposeSongStructure };
