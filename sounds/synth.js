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

const kick = new Tone.MembraneSynth().toMaster();

const clap = new Tone.NoiseSynth({
  noise: {
    type: 'white',
    spread: 50,
    density: 80,
    surface: 12,
    frequency: 40,
  },
  volume: 0,
  envelope: {
    attack: 0.005,
    decay: 0.33,
    sustain: 0,
  },
}).toMaster();

const cymbal = new Tone.NoiseSynth({
  noise: {
    type: 'white',
  },
  spread: 50,
  density: 80,
  surface: 12,
  frequency: 40,
  volume: 0,
  envelope: {
    attack: 0.005,
    decay: 0.06,
    sustain: 0,
  },
}).toMaster();

module.exports = { synth, kick, clap, cymbal };
