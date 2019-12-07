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
    this.setTempo(120);
  }

  setTempo(value) {
    Tone.Transport.bpm.value = value;
  }

  makeGrid() {
    let grid = [];
    for (let i = 0; i < this.width; ++i) {
      let chord = [];
      for (let j = 0; j < this.height; ++j) {
        let node = new AudioNode(j, i, G_MAJOR[j]);
        chord.push(node);
      }
      grid.push(chord);
      this.events.push([]);
    }
    return grid;
  }

  addMeasureToGrid() {
    for (let i = 0; i < 4; ++i) {
      let chord = [];
      for (let j = 0; j < 12; ++j) {
        let node = new AudioNode(j, i, G_MAJOR[j]);
        chord.push(node);
      }
      this.grid.push(chord);
    }
  }

  makeSequence() {
    let chords = this.events.map(chord => new Tone.Event(null, chord));
    let sequenceLength = chords.length;
    let playhead = 0;
    return new Tone.Sequence(
      function(time, event) {
        // reset playhead to 0 on pause...
        Tone.Transport.on('pause', () => {
          playhead = 0;
        });
        // trigger event/chord...
        synth.triggerAttackRelease(event, '16n', time);
        // schedule dom manipulation...
        Tone.Draw.schedule(function() {
          let timeoutValue = 30000 / Tone.Transport.bpm.value;
          if (playhead === sequenceLength) {
            playhead = 0;
          }
          let column = document.querySelector(`.column.index${playhead}`);
          column.classList.add('animate');
          setTimeout(() => {
            column.classList.remove('animate');
          }, timeoutValue);
          ++playhead;
        }, time);
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

  updateSequenceWithCell(col, row) {
    const pitch = this.getCell(col, row).pitch;
    if (this.sequence._events[col].value.includes(pitch)) {
      this.sequence._events[col].value = this.sequence._events[
        col
      ].value.filter(note => note !== pitch);
    } else {
      this.sequence._events[col].value.push(pitch);
    }
  }

  addMeasure() {
    for (let i = 0; i < 4; ++i) {
      this.events.push([]);
    }
    this.addMeasureToGrid();
    this.sequence.dispose();
    this.sequence = this.makeSequence().start();
  }

  toggleCell(col, row) {
    const cell = this.getCell(col, row);
    if (cell.status) {
      cell.status = false;
    } else {
      cell.status = true;
      this.playCell(col, row);
    }
    this.updateSequenceWithCell(col, row);
  }

  startSequence() {
    Tone.Transport.start();
    this.sequence.start();
  }

  stopSequence() {
    Tone.Transport.pause();
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
