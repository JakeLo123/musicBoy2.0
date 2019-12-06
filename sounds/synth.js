const Tone = require('tone');

const synth = new Tone.PolySynth(12, Tone.Synth, {
  oscillator: {
    type: 'triangle',
    volume: 2,
  },
  envelope: {
    attack: 0.005,
    decay: 0.1,
    sustain: 0.3,
    release: 1,
  },
}).toMaster();

module.exports = synth;
