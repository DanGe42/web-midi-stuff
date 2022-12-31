export enum Accidental {
  DoubleFlat = -2, // bb
  Flat = -1, // b
  Natural = 0,
  Sharp = 1, // #
  DoubleSharp = 2 // x
}

export function accidentalString(acc: Accidental): string {
  switch (acc) {
    case Accidental.DoubleFlat:
      return "bb";
    case Accidental.Flat:
      return "b";
    case Accidental.Natural:
      return "";
    case Accidental.Sharp:
      return "#";
    case Accidental.DoubleSharp:
      return "x";
    default:
      const _exhaustive: never = acc;
      return _exhaustive;
  }
}

export interface Notation {
  readonly name: string;
  readonly accidental: Accidental;
  readonly octave: number
}

const letters: readonly string[] = ["C", "D", "E", "F", "G", "A", "B"];

export function parseNote(noteString: string): Notation {
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
