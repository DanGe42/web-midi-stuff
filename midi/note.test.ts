import { Accidental, parseNote, SimpleNote } from './note';

test('parse a simple note', () => {
  let note;
  note = parseNote("C");
  expect(note.accidental).toBe(Accidental.Natural);
  expect(note.name).toBe('C');
  expect(note.octave).toBe(4);

  note = parseNote("D7");
  expect(note.accidental).toBe(Accidental.Natural);
  expect(note.name).toBe('D');
  expect(note.octave).toBe(7);
})

test('parse accidentals', () => {
  let note;
  note = parseNote("C#-1");
  expect(note.accidental).toBe(Accidental.Sharp);
  expect(note.name).toBe('C');
  expect(note.octave).toBe(-1);

  note = parseNote("Dbb7");
  expect(note.accidental).toBe(Accidental.DoubleFlat);
  expect(note.name).toBe('D');
  expect(note.octave).toBe(7);

  note = parseNote("Eb3");
  expect(note.accidental).toBe(Accidental.Flat);
  expect(note.name).toBe('E');
  expect(note.octave).toBe(3);

  note = parseNote("Fx1");
  expect(note.accidental).toBe(Accidental.DoubleFlat);
  expect(note.name).toBe('F');
  expect(note.octave).toBe(1);
})

interface FifthTest {
  readonly note: string;
  readonly fifth: string;
}

([
  { note: "C", fifth: "G" },
  { note: "C#", fifth: "G#" },
  { note: "Db", fifth: "Ab" },
  { note: "D", fifth: "A" },
  { note: "D#", fifth: "A#" },
  { note: "Eb", fifth: "Bb" },
  { note: "E", fifth: "B" },
  { note: "F", fifth: "C" },
  { note: "F#", fifth: "C#" },
  { note: "Gb", fifth: "Db" },
  { note: "G", fifth: "D" },
  { note: "G#", fifth: "D#" },
  { note: "Ab", fifth: "Eb" },
  { note: "A", fifth: "E" },
  { note: "A#", fifth: "F" }, // edge case
  { note: "Bb", fifth: "F" },
  { note: "B", fifth: "F#" },
] as readonly FifthTest[]).forEach(fifthTest => {
  const { note, fifth } = fifthTest;
  // whole, whole, half, whole
  test(`major fifth (7 half steps): ${note} -> ${fifth}`, () => {
    expect(SimpleNote.parseNote(note).halfStep(7)).toStrictEqual(SimpleNote.parseNote(fifth));
  });
});

['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']
  .forEach(tone => {
    test(`octave results in same tone: ${tone}`, () => {
      expect(SimpleNote.parseNote(tone).octave()).toStrictEqual(SimpleNote.parseNote(tone));
    })
  })

interface MajorScalesTest {
  readonly tonic: string;
  readonly scale: string;
}

([
  { tonic: "C", scale: "C D E F G A B C" },
  // { tonic: "C#", scale: "G#" },
  // { tonic: "Db", scale: "Ab" },
  { tonic: "D", scale: "A" },
  // { tonic: "D#", scale: "A#" },
  // { tonic: "Eb", scale: "Bb" },
  { tonic: "E", scale: "B" },
  { tonic: "F", scale: "C" },
  // { tonic: "F#", scale: "C#" },
  // { tonic: "Gb", scale: "Db" },
  { tonic: "G", scale: "D" },
  // { tonic: "G#", scale: "D#" },
  // { tonic: "Ab", scale: "Eb" },
  { tonic: "A", scale: "E" },
  // { tonic: "A#", scale: "F" }, // edge case
  // { tonic: "Bb", scale: "F" },
  { tonic: "B", scale: "F#" },
] as readonly MajorScalesTest[])

// test('given a note, a half step gets the next tone', () => {
//   const note = Note.fromName('D');
//   expect(note.halfStep()).toEqual(Note.fromName('D#'));
// });

// test('given a note, an octave results in the same note name', () => {
//   const note = Note.fromName('D#');
//   expect(note.octave()).toEqual(Note.fromName('D#'));
// })

// test('given all 12 tones, adding a half step each shifts all tones', () => {
//   const notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
//     .map(tone => Note.fromName(tone));
//   const halfStepped = notes.map(note => note.halfStep());
//   const shiftedNotes = ["A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A"]
//     .map(tone => Note.fromName(tone));
//   expect(halfStepped).toEqual(shiftedNotes);
// });
