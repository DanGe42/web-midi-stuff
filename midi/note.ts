import { Accidental, parseNote } from "./notation";
import { calculateTonePosition, inferNote, TonePosition, tonesEquivalent } from "./semitones";

export class SimpleNote {
  private readonly tonePosition: TonePosition;

  constructor(
    readonly name: string,
    readonly accidental: Accidental
  ) {
    this.tonePosition = calculateTonePosition(name, accidental);
  }

  static parseNote(noteString: string): SimpleNote {
    const { name, accidental } = parseNote(noteString);
    return new SimpleNote(name, accidental);
  }

  isEquivalentTo(other: SimpleNote): boolean {
    return tonesEquivalent(this.tonePosition, other.tonePosition)
  }

  halfStep(steps?: number) {
    if (typeof steps === 'undefined') {
      steps = 1;
    }

    let preferredAccidental: Accidental = this.accidental;
    if (preferredAccidental === Accidental.DoubleFlat) {
      preferredAccidental = Accidental.Flat;
    }
    if (preferredAccidental === Accidental.DoubleSharp) {
      preferredAccidental = Accidental.Sharp;
    }

    const { name: toneName, accidental } = inferNote(this.tonePosition + steps, preferredAccidental);
    return new SimpleNote(toneName, accidental);
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

// function calculateMidiIndex(letter: string, accidental: Accidental, octave: number) {
//   const letterIndex = semitones.indexOf(letter);
//   if (letterIndex == -1) {
//     throw new Error();
//   }
//   const tonePosition = letterIndex + accidental;
//   // With knowledge of the tone, the octave, and the accidental, we can
//   // compute the MIDI note value.
//   // MIDI tone 0 is C-1, 127 is G9
//   const midiNote: number = (octave + 1) * 12 + tonePosition;
//   if (midiNote < 0 || midiNote > 127) {
//     throw new Error("Note resulted in out of bounds MIDI note");
//   }
//   return midiNote;
// }
