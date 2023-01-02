import { Accidental } from "./notation";
import { Note } from "./note";

const majorSteps: readonly number[] = [0, 2, 4, 5, 7, 9, 11]
export class MajorScale<T> {
  private readonly preferredAccidental: Accidental;
  constructor(
    readonly tonic: Note<T>,
  ) {
    if (tonic.accidental !== Accidental.Natural) {
      this.preferredAccidental = tonic.accidental;
    } else if (tonic.name === 'F') {
      // F major is the only white key major tonic scale that uses flats
      this.preferredAccidental = Accidental.Flat;
    } else {
      this.preferredAccidental = Accidental.Sharp;
    }
  }

  getKey(degree: number): T {
    const steps = majorSteps[degree % majorSteps.length];
    return this.tonic.halfStep(steps, this.preferredAccidental);
  }

  generateScale(numKeys?: number): T[] {
    const keys = Array(numKeys || 8);
    for (let i = 0; i < keys.length; i += 1) {
      keys[i] = this.getKey(i);
    }
    return keys;
  }
}
