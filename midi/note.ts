// Convention: tones from accidentals are two letters, composed from its neighbors.
// The left corresponds to the sharp; the right corresponds to the flat.
// e.g. CD -> C# or Db
const semitones: readonly string[] = ["C", "CD", "D", "DE", "E", "F", "FG", "G", "GA", "A", "AB", "B"];
const letters: readonly string[] = ["C", "D", "E", "F", "G", "A", "B"];

export enum Accidental {
  DoubleFlat = -2, // bb
  Flat = -1, // b
  Natural = 0,
  Sharp = 1, // #
  DoubleSharp = 2 // x
}

// exported for testing
export interface NoteNotation {
  readonly name: string;
  readonly accidental: Accidental;
  readonly octave: number
}

// exported for testing
export function parseNote(noteString: string): NoteNotation {
  const letter = noteString[0];
  if (!letters.includes(letter)) {
    throw new Error(`Letter ${letter} is not a valid note name`);
  }

  // Look for an accidental
  let remaining: string = noteString.substring(1);
  let accidental: Accidental;
  if (remaining.startsWith("bb")) {
    accidental = Accidental.DoubleFlat;
    remaining = remaining.substring(2);
  } else {
    switch (remaining[0]) {
      case "b":
        accidental = Accidental.Flat;
        remaining = remaining.substring(1);
        break;
      case "#":
        accidental = Accidental.Sharp;
        remaining = remaining.substring(1);
        break;
      case "x":
        accidental = Accidental.DoubleFlat;
        remaining = remaining.substring(1);
        break;
      default:
        accidental = Accidental.Natural;
        // don't advance remaining; it's likely a number
        break;
    }
  }

  // If no octave is specified, parseInt will return NaN
  // Assume we're at the octave for middle C (C4)
  let octave: number;
  if (remaining.length == 0) {
    octave = 4;
  } else {
    octave = parseInt(remaining, 10);
    if (isNaN(octave)) {
      throw new Error(`invalid octave ${remaining}`);
    }
  }

  return { name: letter, accidental, octave };
}

export class SimpleNote {
  private readonly toneIndex: number;

  constructor(
    readonly name: string,
    readonly accidental: Accidental
  ) {
    this.toneIndex = calcToneIndex(name, accidental);
  }

  static parseNote(noteString: string): SimpleNote {
    const { name, accidental } = parseNote(noteString);
    return new SimpleNote(name, accidental);
  }

  isEquivalent(note: SimpleNote): boolean {
    return this.toneIndex === note.toneIndex;
  }

  halfStep(steps?: number) {
    if (typeof steps === 'undefined') {
      steps = 1;
    }

    // Handle wraparound (e.g. G# -> A)
    let newToneIndex = (this.toneIndex + steps) % semitones.length;
    if (newToneIndex < 0) {
      // Handle going into negatives (because modulo of negatives is negative)
      newToneIndex = newToneIndex + semitones.length;
    }

    // What do we call this new note now?
    const toneName = semitones[newToneIndex];
    // if we are at a "white key", return as-is. We take advantage of
    // our own naming convention: a "white key" is a single letter whereas a
    // "black key" has an accidental and therefore is 2 characters.
    if (toneName.length === 1) {
      return new SimpleNote(toneName, Accidental.Natural);
    }

    // Otherwise, we'll pick the name depending on whether this is originally a
    // sharp or a flat. We'll keep consistent accidentals.
    // Note that we never output a double sharp/flat; things can easily get very
    // dicey if we allow that!
    if (this.accidental === Accidental.DoubleFlat || this.accidental === Accidental.Flat) {
      return new SimpleNote(toneName[1], Accidental.Flat);
    } else {
      return new SimpleNote(toneName[0], Accidental.Sharp);
    }
  }

  fullStep(steps?: number): SimpleNote {
    if (typeof steps === 'undefined') {
      steps = 1;
    }
    return this.halfStep(steps * 2);
  }

  octave(steps?: number): SimpleNote {
    if (typeof steps === 'undefined') {
      steps = 1;
    }
    return this.halfStep(steps * 12);
  }
}

function calcToneIndex(letter: string, accidental: Accidental): number {
  const letterIndex = semitones.indexOf(letter);
  if (letterIndex == -1) {
    throw new Error();
  }
  const toneIndex = letterIndex + accidental;
  if (toneIndex < 0) {
    // Negative tones can happen for Cb and Cbb.
    return toneIndex + semitones.length;
  } else {
    // Positive tones can happen for G# and Gx.
    return toneIndex % semitones.length;
  }
}

function calculateMidiIndex(letter: string, accidental: Accidental, octave: number) {
  const letterIndex = semitones.indexOf(letter);
  if (letterIndex == -1) {
    throw new Error();
  }
  const toneIndex = letterIndex + accidental;
  // With knowledge of the tone, the octave, and the accidental, we can
  // compute the MIDI note value.
  // MIDI tone 0 is C-1, 127 is G9
  const midiNote: number = (octave + 1) * 12 + toneIndex;
  if (midiNote < 0 || midiNote > 127) {
    throw new Error("Note resulted in out of bounds MIDI note");
  }
  return midiNote;
}
