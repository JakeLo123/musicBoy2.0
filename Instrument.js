const synth = require('./sounds/synth.js');
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

class Instrument {
  constructor(width) {
    this.height = 12;
    this.width = width;
    this.grid = this.makeGrid();
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
    }
    return output;
  }

  getCell(col, row) {
    return this.grid[col][row];
  }

  playCell(col, row) {
    const cell = this.getCell(col, row);
    synth.triggerAttackRelease(cell.pitch, '8n');
  }
}

module.exports = Instrument;
