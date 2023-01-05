export enum MidiStatus {
  NoteOff = 0b1000, // 8
  NoteOn = 0b1001, // 9
  PolyKeyPressure = 0b1010, // A
  ControllerChange = 0b1011, // B
  ProgramChange = 0b1100, // C
  ChannelPressure = 0b1101, // D
  PitchBend = 0b1110 // E
}

export class MidiData {
  status: MidiStatus;
  channel: number;
  data1: number;
  data2: number;

  constructor(status: MidiStatus, channel: number, data1: number, data2: number) {
    this.status = status;
    this.channel = channel;
    this.data1 = data1;
    this.data2 = data2;
  }

  static fromEventData(data: Uint8Array): MidiData {
    if (data.length != 3) {
      throw new Error(`Unexpected MIDI data array length ${data.length} != 3`);
    }
    const data0 = data[0];
    const status: MidiStatus = data0 >> 4;
    const channel = data0 & 0b1111;
    if (!MidiStatus[status]) {
      throw new Error(`Invalid MIDI status byte ${data0}`);
    }
    const data1 = data[1];
    const data2 = data[2];
    
    return new MidiData(status, channel, data1, data2);
  }
}
