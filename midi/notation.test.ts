import { Accidental, parseNote } from "./notation";

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
