const Tone = require('tone');

const synth = new Tone.PolySynth({
  polyphony: 12,
  volume: 0,
  detune: 0,
  voice: Tone.Synth,
}).toMaster();

module.exports = synth;
