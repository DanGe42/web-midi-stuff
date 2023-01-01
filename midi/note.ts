import { Accidental, parseNote } from "./notation";
import { TonePosition, calculateTonePosition, tonesEquivalent, inferNote, MidiPosition, calculateMidiPosition, calculateMidiOctave } from "./semitones";

export interface Note<T> {
  readonly name: string;
  readonly accidental: Accidental;

  isEquivalentTo(other: T): boolean;
  halfStep(steps?: number): T;
}

export class SimpleNote implements Note<SimpleNote> {
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

  private preferredAccidental(): Accidental {
    if (this.accidental === Accidental.DoubleFlat) {
      return Accidental.Flat;
    }
    if (this.accidental === Accidental.DoubleSharp) {
      return Accidental.Sharp;
    }
    return this.accidental;
  }

  halfStep(steps?: number): SimpleNote {
    if (typeof steps === 'undefined') {
      steps = 1;
    }

    const { name: toneName, accidental } = inferNote(
      this.tonePosition + steps, this.preferredAccidental());
    return new SimpleNote(toneName, accidental);
  }

  fullStep(steps?: number): SimpleNote {
    if (typeof steps === 'undefined') {
      steps = 1;
    }
    return this.halfStep(steps * 2);
  }

  octaveStep(steps?: number): SimpleNote {
    if (typeof steps === 'undefined') {
      steps = 1;
    }
    return this.halfStep(steps * 12);
  }
}

export class MidiNote implements Note<MidiNote> {
  private readonly midiPosition: MidiPosition;

  constructor(
    readonly name: string,
    readonly accidental: Accidental,
    readonly octave: number
  ) {
    this.midiPosition = calculateMidiPosition(name, accidental, octave);
  }

  static parseNote(noteString: string): MidiNote {
    const { name, accidental, octave } = parseNote(noteString);
    return new MidiNote(name, accidental, octave);
  }

  isEquivalentTo(other: MidiNote): boolean {
    return tonesEquivalent(this.midiPosition, other.midiPosition)
  }

  private preferredAccidental(): Accidental {
    if (this.accidental === Accidental.DoubleFlat) {
      return Accidental.Flat;
    }
    if (this.accidental === Accidental.DoubleSharp) {
      return Accidental.Sharp;
    }
    return this.accidental;
  }

  halfStep(steps?: number): MidiNote {
    if (typeof steps === 'undefined') {
      steps = 1;
    }

    const { name: toneName, accidental } = inferNote(
      this.midiPosition + steps, this.preferredAccidental());
    // Since inferNote never returns Cb/Cbb or B#/Bx, this calculation should be safe
    const newOctave = calculateMidiOctave(this.midiPosition);
    return new MidiNote(toneName, accidental, newOctave);
  }

  fullStep(steps?: number): MidiNote {
    if (typeof steps === 'undefined') {
      steps = 1;
    }
    return this.halfStep(steps * 2);
  }

  octaveStep(steps?: number): MidiNote {
    if (typeof steps === 'undefined') {
      steps = 1;
    }
    return this.halfStep(steps * 12);
  }
}
