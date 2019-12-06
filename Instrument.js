const { synth, kick } = require('./sounds/synth.js');
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

class Instrument {
  constructor(width) {
    this.height = 12;
    this.width = width;
    this.events = [];
    this.grid = this.makeGrid();
    this.sequence = this.makeSequence();
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

  makeSequence() {
    let chords = this.events.map(chord => new Tone.Event(null, chord));
    let i = 0;
    return new Tone.Sequence(
      function(time, event) {
        Tone.Draw.schedule(function() {
          const curNode = document.querySelector(`.column.index${i}`);
          curNode.classList.add('animate');
          ++i;
          if (i === 8) i = 0;
        });
        synth.triggerAttackRelease(event, '16n', time);
      },
      chords,
      '8n'
    );
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
    if (this.sequence._events[col].value.includes(pitch)) {
      this.sequence._events[col].value = this.sequence._events[
        col
      ].value.filter(note => note !== pitch);
    } else {
      this.sequence._events[col].value.push(pitch);
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

  startSequence() {
    Tone.Transport.start();
    this.sequence.start(0);
  }

  stopSequence() {
    Tone.Transport.stop();
    this.sequence.stop();
  }

  clear() {
    kick.triggerAttackRelease('A1', '8n');
    this.events = [];
    this.grid = this.makeGrid();
    this.sequence.dispose();
    this.sequence = this.makeSequence();
  }
}

module.exports = Instrument;
