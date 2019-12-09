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
    this.grid = this.makeGrid(this.width);
    this.sequence = this.makeSequence();
    this.setTempo(120);
  }

  setTempo(value) {
    Tone.Transport.bpm.value = value;
  }

  makeGrid(width) {
    let grid = [];
    for (let i = 0; i < width; ++i) {
      let column = [];
      for (let j = 0; j < this.height; ++j) {
        let node = new AudioNode(j, i, G_MAJOR[j]);
        column.push(node);
      }
      grid.push(column);
    }
    return grid;
  }

  addColumnsToGrid(n) {
    for (let i = 0; i < n; ++i) {
      let column = [];
      for (let j = 0; j < 12; ++j) {
        let node = new AudioNode(j, i, G_MAJOR[j]);
        column.push(node);
      }
      this.grid.push(column);
    }
    this.disposeSequenceAndMakeNewSequence();
    if (Tone.Transport.state === 'started') {
      this.sequence.start();
    }
  }

  removeColumnsFromGrid(n) {
    if (this.grid.length >= 4) {
      for (let i = 0; i < n; ++i) {
        this.grid.pop();
      }
      this.disposeSequenceAndMakeNewSequence();
      if (Tone.Transport.state === 'started') {
        this.sequence.start();
      }
    } else {
      console.log('cannot remove columns from grid length: ', this.grid.length);
    }
  }

  makeSequence() {
    let chords = this.grid.map(column => {
      let chord = column.reduce((accum, node) => {
        if (node.status) {
          accum.push(node.pitch);
        }
        return accum;
      }, []);
      return new Tone.Event(null, chord);
    });
    let sequenceLength = chords.length;
    let playhead = 0;
    return new Tone.Sequence(
      function(time, event) {
        // reset playhead to 0 on pause...
        Tone.Transport.on('start', () => {
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
          let columns = document.querySelectorAll(`.column.index${playhead}`);
          columns.forEach(column => column.classList.add('animate'));

          setTimeout(() => {
            columns.forEach(column => column.classList.remove('animate'));
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

  toggleCellWithinSequence(col, row) {
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
    this.toggleCellWithinSequence(col, row);
  }

  startSequence() {
    this.sequence.start();
  }

  stopSequence() {
    this.sequence.stop();
  }

  disposeSequenceAndMakeNewSequence() {
    this.sequence.dispose();
    this.sequence = this.makeSequence();
  }

  clear(width) {
    kick.triggerAttackRelease('A1', '8n');
    this.grid = this.makeGrid(width);
    this.disposeSequenceAndMakeNewSequence();
    this.stopSequence();
  }
}

module.exports = Instrument;
