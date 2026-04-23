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

export function transposeChords(chords, originalKey, targetKey) {
  if (!originalKey || !targetKey || originalKey === targetKey) return chords;

  const origIndex = getNoteIndex(originalKey);
  const targetIndex = getNoteIndex(targetKey);
  if (origIndex === -1 || targetIndex === -1) return chords;

  let delta = targetIndex - origIndex;
  // keep positive delta
  if (delta < 0) delta += 12;

  return chords.map(chord => {
    return chord.replace(/([A-G][b#]?)/g, (match) => {
        const idx = getNoteIndex(match);
        if (idx === -1) return match;
        const newIdx = (idx + delta) % 12;
        return SCALE[newIdx];
    });
  });
}

export function transposeChordLine(line, originalKey, targetKey) {
  if (!line || !originalKey || !targetKey || originalKey === targetKey) return line;

  const origIndex = getNoteIndex(originalKey);
  const targetIndex = getNoteIndex(targetKey);
  if (origIndex === -1 || targetIndex === -1) return line;

  let delta = targetIndex - origIndex;
  if (delta < 0) delta += 12;

  return line.replace(/([A-G][b#]?[\w/#]*)/g, (match) => {
    return match.replace(/^([A-G][b#]?)/, (root) => {
        const idx = getNoteIndex(root);
        if (idx === -1) return root;
        const newIdx = (idx + delta) % 12;
        return SCALE[newIdx];
    });
  });
}
