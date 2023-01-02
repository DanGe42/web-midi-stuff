import { Accidental, accidentalString, parseNote } from "./notation";
import {
  MidiPosition,
  TonePosition,
  calculateMidiOctave,
  calculateMidiPosition,
  calculateTonePosition,
  inferNote,
  tonesEquivalent,
} from "./semitones";

export abstract class Note<T> {
  constructor(
    readonly name: string,
    readonly accidental:Accidental
  ) {
  }

  abstract isEquivalentTo(other: T): boolean;
  abstract halfStep(steps: number, preferredAccidental?: Accidental): T;
  abstract toString(): string;

  fullStep(steps?: number, preferredAccidental?: Accidental): T {
    if (typeof steps === 'undefined') {
      steps = 1;
    }
    return this.halfStep(steps * 2, preferredAccidental);
  }

  octaveStep(steps?: number): T {
    if (typeof steps === 'undefined') {
      steps = 1;
    }
    return this.halfStep(steps * 12);
  }
}

export class SimpleNote extends Note<SimpleNote> {
  private readonly tonePosition: TonePosition;

  constructor(
    name: string,
    accidental: Accidental
  ) {
    super(name, accidental);
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

  halfStep(steps: number, preferredAccidental?: Accidental): SimpleNote {
    preferredAccidental = preferredAccidental || this.preferredAccidental();
    const { name: toneName, accidental } = inferNote(
      this.tonePosition + steps, preferredAccidental);
    return new SimpleNote(toneName, accidental);
  }

  toString(): string {
    return `${this.name}${accidentalString(this.accidental)}`;
  }
}

export class MidiNote extends Note<MidiNote> {
  private readonly midiPosition: MidiPosition;

  constructor(
    name: string,
    accidental: Accidental,
    readonly octave: number
  ) {
    super(name, accidental);
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

  halfStep(steps: number, preferredAccidental?: Accidental): MidiNote {
    preferredAccidental = preferredAccidental || this.preferredAccidental();
    const { name: toneName, accidental } = inferNote(
      this.midiPosition + steps, preferredAccidental);
    // Since inferNote never returns Cb/Cbb or B#/Bx, this calculation should be safe
    const newOctave = calculateMidiOctave(this.midiPosition);
    return new MidiNote(toneName, accidental, newOctave);
  }

  toString(): string {
    return `${this.name}${accidentalString(this.accidental)}${this.octave}`;
  }
}
