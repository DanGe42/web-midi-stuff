const documentReady = function (window: Window, navigator: Navigator) {
    const messagesElement: HTMLElement = document.getElementById("messages") as HTMLElement;
    const appendMessage = function (message: string) {
        const li = document.createElement("li");
        li.textContent = message;
        messagesElement.appendChild(li);
    }
    if (!window.isSecureContext) {
        appendMessage("not secure context!");
    }

    let midi: WebMidi.MIDIAccess | null = null;  // global MIDIAccess object
    function onMIDISuccess(midiAccess: WebMidi.MIDIAccess) {
        appendMessage("MIDI connected!");
        midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)
        console.log(midi);
        listInputsAndOutputs(midi);
        startLoggingMIDIInput(midi);
    }

    function onMIDIFailure(msg: string) {
        appendMessage(`failed to get MIDI access - ${msg}`)
    }

    function listInputsAndOutputs(midiAccess: WebMidi.MIDIAccess) {
        for (const entry of midiAccess.inputs) {
            const input = entry[1];
            console.log(`Input port [type:'${input.type}']` +
                ` id:'${input.id}'` +
                ` manufacturer:'${input.manufacturer}'` +
                ` name:'${input.name}'` +
                ` version:'${input.version}'`);
        }

        for (const entry of midiAccess.outputs) {
            const output = entry[1];
            console.log(`Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`);
        }
    }


    function onMIDIMessage(event: WebMidi.MIDIMessageEvent) {
        let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
        for (const character of event.data) {
            str += `0x${character.toString(16)} `;
        }
        console.log(str);
    }

    function startLoggingMIDIInput(midiAccess: WebMidi.MIDIAccess) {
        midiAccess.inputs.forEach((entry) => { entry.onmidimessage = onMIDIMessage; });
    }


    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

}

window.onload = function() { documentReady(window, window.navigator) };
