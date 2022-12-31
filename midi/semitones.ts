import { Accidental, Notation } from "./notation";

// The list of all semitones in an octave. C is the first semitone in the
// octave, following the convention that Western music and MIDI uses. This
// list is ordered, and the position of a particular semitone in this list
// will come in very handy.
//
// Typically, the tones are named as follows:
// * C C# D D# E F F# G G# A A# B
// * C Db D Eb E F Gb G Ab A Bb B
//
// For piano music, tones without accidentals are the white keys, whereas tones
// with accidentals (sharp (#) or flat (b)) are the black keys. As one may
// observe, each black key has two names (e.g. the key between C and D can be
// called either C# or Db). For our purposes, we will instead label them with
// both the neighboring white keys (e.g. C#/Db will be called CD). This
// convention will incidentally make it easier to implement functionality that
// decides whether a CD should be a C# or a Db.
const semitones: readonly string[] = ["C", "CD", "D", "DE", "E", "F", "FG", "G", "GA", "A", "AB", "B"];

// The position of a semitone within the ordered list of semitones. Note that
// the position can be slightly out of bounds of the array and should not be
// considered safe to directly index into the list.
export type TonePosition = number;

export function calculateTonePosition(letter: string, accidental: Accidental): TonePosition {
  const letterIndex = semitones.indexOf(letter);
  if (letterIndex == -1) {
    throw new Error();
  }

  return letterIndex + accidental;
}

function clamp(position: TonePosition): TonePosition {
  // Positive out-of-bound tones can happen for B# and Bx.
  position = position % semitones.length;
  // Negative tones can happen for Cb and Cbb.
  if (position < 0) {
    position = position + semitones.length;
  }
  return position;
}

export function tonesEquivalent(pos1: TonePosition, pos2: TonePosition): boolean {
  return clamp(pos1) === clamp(pos2);
}

/**
 * Retrieves the note corresponding to a tone position and the preferred accidental.
 * Does not support double flats or double sharps. All notes are returned as
 * Notations but with the octave set to 0.
 */
export function inferNote(position: TonePosition, preferredAccidental?: Accidental): Notation {
  if (preferredAccidental === Accidental.DoubleFlat ||
    preferredAccidental === Accidental.DoubleSharp) {
    throw new Error("inferNote does not support double sharps or double flats");
  }
  const toneName = semitones[clamp(position)];
  // if we are at a "white key", return as-is. We take advantage of
  // our own naming convention: a "white key" is a single letter whereas a
  // "black key" has an accidental and therefore is 2 characters.
  if (toneName.length === 1) {
    return { name: toneName, accidental: Accidental.Natural, octave: 0 };
  }

  // Otherwise, we'll pick the name depending on whether this is originally a
  // sharp or a flat. We'll keep consistent accidentals.
  // Note that we never output a double sharp/flat; things can easily get very
  // dicey if we allow that!
  if (preferredAccidental === Accidental.Flat) {
    return { name: toneName[1], accidental: Accidental.Flat, octave: 0 };
  } else {
    return { name: toneName[0], accidental: Accidental.Sharp, octave: 0 };
  }
}
