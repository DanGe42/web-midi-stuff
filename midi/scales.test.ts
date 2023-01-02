import { SimpleNote } from "./note";
import { MajorScale } from "./scales";

interface MajorScalesTest {
  readonly tonic: string;
  readonly scale: string;
}

([
  { tonic: "F", scale: "F G A Bb C D E F" },
  { tonic: "C", scale: "C D E F G A B C" },
  { tonic: "G", scale: "G A B C D E F# G" },
  { tonic: "D", scale: "D E F# G A B C# D" },
  { tonic: "A", scale: "A B C# D E F# G# A" },
  { tonic: "E", scale: "E F# G# A B C# D# E" },
  { tonic: "B", scale: "B C# D# E F# G# A# B" },
] as readonly MajorScalesTest[]).forEach(tc => {
  const expectedScale = tc.scale.split(' ').map(n => SimpleNote.parseNote(n));
  test(`scale in ${tc.tonic} major: ${tc.scale}`, () => {
    const majorScale = new MajorScale(SimpleNote.parseNote(tc.tonic));
    expect(majorScale.generateScale(8)).toStrictEqual(expectedScale);
  });
});
