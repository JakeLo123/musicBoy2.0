// const synth = require('./sounds/synth.js');
const Instrument = require('./instrument');

const grid = document.getElementById('grid');
const instrument = new Instrument(16);

function createGrid(height, width) {
  for (let i = 0; i < width; ++i) {
    let column = document.createElement('div');
    column.classList.add('column');
    for (let j = 0; j < height; ++j) {
      let cell = document.createElement('div');
      cell.dataset.row = j;
      cell.dataset.col = i;
      cell.classList.add('cell');
      column.append(cell);
    }
    grid.append(column);
  }
}

createGrid(12, 16);

grid.addEventListener('click', function(event) {
  const cell = event.target;
  instrument.playCell(cell.dataset.col, cell.dataset.row);
  cell.classList.add('on');
});
