import { Accidental } from './notation';
import { SimpleNote } from './note';

test('given all 12 semitones, adding a half step each shifts all tones', () => {
  const notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
    .map(tone => SimpleNote.parseNote(tone));
  const halfStepped = notes.map(note => note.halfStep(1));
  const shiftedNotes = ["A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A"]
    .map(tone => SimpleNote.parseNote(tone));
  expect(halfStepped).toEqual(shiftedNotes);
});

test('given all 12 semitones, subtracting a half step each shifts all tones', () => {
  const notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
    .map(tone => SimpleNote.parseNote(tone));
  const halfStepped = notes.map(note => note.halfStep(-1));
  const shiftedNotes = ["G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G"]
    .map(tone => SimpleNote.parseNote(tone));
  expect(halfStepped).toEqual(shiftedNotes);
});

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
      expect(SimpleNote.parseNote(tone).octaveStep()).toStrictEqual(SimpleNote.parseNote(tone));
    })
  })

test('the major subdominant (4th) of F is Bb', () => {
  expect(SimpleNote.parseNote('F').halfStep(5, Accidental.Flat))
    .toStrictEqual(SimpleNote.parseNote('Bb'));
})
