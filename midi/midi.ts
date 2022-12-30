export class Midi {
  private midiAccess: WebMidi.MIDIAccess;

  constructor(midiAccess: WebMidi.MIDIAccess) {
    this.midiAccess = midiAccess;
  }

  // debug methods
  listInputsAndOutputs() {
    for (const entry of this.midiAccess.inputs) {
      const input = entry[1];
      console.log(`Input port [type:'${input.type}']` +
        ` id:'${input.id}'` +
        ` manufacturer:'${input.manufacturer}'` +
        ` name:'${input.name}'` +
        ` version:'${input.version}'`);
    }

    for (const entry of this.midiAccess.outputs) {
      const output = entry[1];
      console.log(`Output port [type:'${output.type}']` +
        ` id:'${output.id}'` +
        ` manufacturer:'${output.manufacturer}'` +
        ` name:'${output.name}'` +
        ` version:'${output.version}'`);
    }
  }
  
  startLoggingMIDIInput() {
    this.midiAccess.inputs.forEach((entry) => { entry.onmidimessage = this.logMIDIInput; });
  }

  private logMIDIInput(event: WebMidi.MIDIMessageEvent) {
    let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
    for (const character of event.data) {
      str += `0x${character.toString(16)} `;
    }
    console.log(str);
  }
}

export async function requestMidiAccess(navigator: Navigator) {
  const midiAccess = await navigator.requestMIDIAccess();
  return new Midi(midiAccess);
}
