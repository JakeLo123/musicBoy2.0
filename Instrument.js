const synth = require('./sounds/synth.js');
const Tone = require('tone');
const AudioNode = require('./audioNode.js');

const G_MAJOR = {
  0: 'D5',
  1: 'C5',
  2: 'B4',
  3: 'A4',
  4: 'G4',
  5: 'F#4',
  6: 'E4',
  7: 'D4',
  8: 'C4',
  9: 'B3',
  10: 'A3',
  11: 'G3',
};

// function playChord(time, note) {
//   synth.triggerAttackRelease(time, note);
// }

class Instrument {
  constructor(width) {
    this.height = 12;
    this.width = width;
    this.events = [];
    this.grid = this.makeGrid();
    this.sequence = new Tone.Sequence(
      function(time, note) {
        synth.triggerAttackRelease(time, note);
      },
      this.events,
      '8n'
    );
  }

  makeGrid() {
    let output = [];
    for (let i = 0; i < this.width; ++i) {
      let chord = [];
      for (let j = 0; j < this.height; ++j) {
        let node = new AudioNode(j, i, G_MAJOR[j]);
        chord.push(node);
      }
      output.push(chord);
      this.events.push([]);
    }
    return output;
  }

  getCell(col, row) {
    return this.grid[col][row];
  }

  playCell(col, row) {
    const cell = this.getCell(col, row);
    synth.triggerAttackRelease(cell.pitch, '16n');
  }

  updateSequence(col, row) {
    const pitch = this.getCell(col, row).pitch;
    let event = this.sequence._events[col]._events;
    console.log('event...', event);
    if (event.includes(pitch)) {
      console.log('this even includes pitch: ', pitch);
      event = event.filter(note => note !== pitch);
    } else {
      event.push(pitch);
    }
  }

  toggleCell(col, row) {
    const cell = this.getCell(col, row);
    if (cell.status) {
      cell.status = false;
    } else {
      cell.status = true;
      this.playCell(col, row);
    }
    this.updateSequence(col, row);
  }
}

module.exports = Instrument;
