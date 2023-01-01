import { Accidental, accidentalString } from "./notation";
import { calculateMidiOctave, calculateMidiPosition, calculateTonePosition, inferNote, MidiPosition, TonePosition, tonesEquivalent } from "./semitones";

interface CalculateTonePositionTest {
  readonly letter: string;
  readonly accidental: Accidental;
  readonly expected: TonePosition;
}

([
  { letter: 'D', accidental: Accidental.DoubleSharp, expected: 4 },
  { letter: 'D', accidental: Accidental.Sharp, expected: 3 },
  { letter: 'D', accidental: Accidental.Natural, expected: 2 },
  { letter: 'D', accidental: Accidental.Flat, expected: 1 },
  { letter: 'D', accidental: Accidental.DoubleFlat, expected: 0 },
  { letter: 'C', accidental: Accidental.DoubleFlat, expected: -2 },
  { letter: 'B', accidental: Accidental.DoubleSharp, expected: 13 },
] as readonly CalculateTonePositionTest[]).forEach(t => {
  const { letter, accidental, expected } = t;
  test(`tone position of ${letter}${accidentalString(accidental)} is ${expected}`, () => {
    expect(calculateTonePosition(letter, accidental)).toBe(expected);
  });
});

test('tones are equivalent if they are the same', () => {
  expect(tonesEquivalent(3, 3)).toBeTruthy;
  expect(tonesEquivalent(4, 7)).toBeFalsy;
});
test('tones are equivalent if they are clamped to be the same', () => {
  expect(tonesEquivalent(-2, 10)).toBeTruthy;
  expect(tonesEquivalent(12, 0)).toBeTruthy;
  expect(tonesEquivalent(-1, 13)).toBeFalsy;
});

interface InferTest {
  readonly pos: TonePosition;
  readonly pref: Accidental | undefined;
  readonly expLetter: string;
  readonly expAcc: Accidental;
}

([
  { pos: 3, pref: Accidental.Flat, expLetter: 'E', expAcc: Accidental.Flat },
  { pos: 3, pref: Accidental.Sharp, expLetter: 'D', expAcc: Accidental.Sharp },
  { pos: 3, pref: undefined, expLetter: 'D', expAcc: Accidental.Sharp },
  // white key semitones stay as naturals
  { pos: 0, pref: Accidental.Flat, expLetter: 'C', expAcc: Accidental.Natural },
  { pos: 0, pref: Accidental.Sharp, expLetter: 'C', expAcc: Accidental.Natural },
] as readonly InferTest[]).forEach(t => {
  test(`position ${t.pos} is inferred to ${t.expLetter}${accidentalString(t.expAcc)}`, () => {
    const note = inferNote(t.pos, t.pref);
    expect(note.name).toBe(t.expLetter);
    expect(note.accidental).toBe(t.expAcc);
  })
})

test('calculateMidiPosition', () => {
  expect(calculateMidiPosition("F", Accidental.Sharp, 6)).toBe(90);
  expect(calculateMidiPosition("C", Accidental.Natural, -1)).toBe(0);
  expect(calculateMidiPosition("D", Accidental.DoubleSharp, 5)).toBe(76);
})

test('calculateMidiOctave', () => {
  expect(calculateMidiOctave(24)).toBe(1); // C1
  expect(calculateMidiOctave(0)).toBe(-1); // C-1
  expect(calculateMidiOctave(90)).toBe(6); // F#6/Gb6
})
