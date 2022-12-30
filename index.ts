import { Midi, requestMidiAccess } from './midi/midi';

const documentReady = async function (window: Window, navigator: Navigator) {
  const messagesElement: HTMLElement = document.getElementById("messages") as HTMLElement;
  const appendMessage = function (message: string) {
    const li = document.createElement("li");
    li.textContent = message;
    messagesElement.appendChild(li);
  }
  if (!window.isSecureContext) {
    appendMessage("not secure context!");
  }

  try {
    const midi: Midi = await requestMidiAccess(navigator);
    appendMessage("MIDI connected!");
    midi.listInputsAndOutputs();
    midi.startLoggingMIDIInput();
  } catch (msg: any) {
    appendMessage(`failed to get MIDI access - ${msg}`)
  }
}

window.onload = function () { documentReady(window, window.navigator) };
