const { kick, clap, cymbal } = require('./sounds/synth.js');
const AudioNode = require('./audioNode.js');

class Drums {
  constructor(width) {
    this.height = 3;
    this.width = width;
    this.grid = this.makeGrid();
    // this.kicks =
    // this.claps
    // this.cymbals
  }

  makeGrid() {
    let grid = [];
    for (let i = 0; i < this.width; ++i) {
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

  addColumnsToGrid(n) {
    for (let i = 0; i < n; ++i) {
      let column = [];
      for (let j = 0; j < 12; ++j) {
        let sound;
        if (j === 2) sound = 'D1';
        else sound = '16n';
        let node = new AudioNode(j, i, sound);
        column.push(node);
      }
      this.grid.push(column);
      // this.disposeSequenceAndMakeNewSequence();
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
    // this.toggleCellWithinSequence(col, row);
  }
}

module.exports = Drums;
