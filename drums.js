const { kick, clap, cymbal } = require('./sounds/synth.js');
const Tone = require('tone');
const AudioNode = require('./audioNode.js');

class Drums {
  constructor(width) {
    this.height = 3;
    this.width = width;
    this.grid = this.makeGrid(this.width);
    this.kicks = this.makeKickSequence();
    this.claps = this.makeClapSequence();
    this.cymbals = this.makeCymbalSequence();
  }

  makeGrid(width) {
    let grid = [];
    for (let i = 0; i < width; ++i) {
      let column = [];
      for (let j = 0; j < this.height; ++j) {
        let sound;
        if (j === 2) sound = 'D1';
        else sound = '16n';
        let node = new AudioNode(j, i, sound);
        column.push(node);
      }
      grid.push(column);
    }
    return grid;
  }

  startSequences() {
    this.kicks.start();
    this.claps.start();
    this.cymbals.start();
  }

  stopSequences() {
    this.kicks.stop();
    this.claps.stop();
    this.cymbals.stop();
  }

  addColumnsToGrid(n) {
    for (let i = 0; i < n; ++i) {
      let column = [];
      for (let j = 0; j < 3; ++j) {
        let sound;
        if (j === 2) sound = 'D1';
        else sound = '16n';
        let node = new AudioNode(j, i, sound);
        column.push(node);
      }
      this.grid.push(column);
    }
    this.disposeSequenceAndMakeNewSequences();
    if (Tone.Transport.state === 'started') {
      console.log('asdfh');
      this.startSequences();
    }
  }

  removeColumnsFromGrid(n) {
    if (this.grid.length >= 4) {
      for (let i = 0; i < n; ++i) {
        this.grid.pop();
      }
      this.disposeSequenceAndMakeNewSequences();
      if (Tone.Transport.state === 'started') {
        this.startSequences();
      }
    } else {
      console.log('cannot remove columns from grid length: ', this.grid.length);
    }
  }

  getCell(col, row) {
    return this.grid[col][row];
  }

  playCell(col, row) {
    const cell = this.getCell(col, row);
    const sound = row == 2 ? kick : row == 1 ? clap : cymbal;
    if (sound === kick) sound.triggerAttackRelease(cell.pitch, '16n');
    else sound.triggerAttackRelease('16n');
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

  toggleCellWithinSequence(col, row) {
    if (row == 2) {
      if (this.kicks._events[col].value === 0)
        this.kicks._events[col].value = 'D1';
      else this.kicks._events[col].value = 0;
    } else if (row == 1) {
      if (this.claps._events[col].value === 0)
        this.claps._events[col].value = '16n';
      else this.claps._events[col].value = 0;
    } else if (row == 0) {
      if (this.cymbals._events[col].value === 0)
        this.cymbals._events[col].value = '16n';
      else this.cymbals._events[col].value = 0;
    }
  }

  makeKickSequence() {
    let kicks = this.grid.map(column => {
      let node = column[2];
      if (node.status) return node.pitch;
      else return 0;
    });
    let seq = new Tone.Sequence(
      function(time, note) {
        if (note !== 0) kick.triggerAttackRelease(note, '16n');
      },
      kicks,
      '8n'
    );
    return seq;
  }

  makeClapSequence() {
    let claps = this.grid.map(column => {
      let node = column[1];
      if (node.status) return node.pitch;
      else return 0;
    });
    let seq = new Tone.Sequence(
      function(time, note) {
        if (note !== 0) clap.triggerAttackRelease('16n');
      },
      claps,
      '8n'
    );
    return seq;
  }

  makeCymbalSequence() {
    let cymbals = this.grid.map(column => {
      let node = column[0];
      if (node.status) return node.pitch;
      else return 0;
    });
    let seq = new Tone.Sequence(
      function(time, note) {
        if (note !== 0) cymbal.triggerAttackRelease('16n');
      },
      cymbals,
      '8n'
    );
    return seq;
  }

  disposeSequenceAndMakeNewSequences() {
    this.kicks.dispose();
    this.claps.dispose();
    this.cymbals.dispose();
    this.kicks = this.makeKickSequence();
    this.claps = this.makeClapSequence();
    this.cymbals = this.makeCymbalSequence();
  }

  clear(width) {
    this.grid = this.makeGrid(width);
    this.disposeSequenceAndMakeNewSequences();
    this.stopSequences();
  }
}

module.exports = Drums;
