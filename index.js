const Instrument = require('./instrument');

const grid = document.getElementById('grid');
const playPauseButton = document.getElementById('play-pause');
const clearButton = document.getElementById('clear');
const instrument = new Instrument(16);

function createGrid(height, width) {
  for (let i = 0; i < width; ++i) {
    let column = document.createElement('div');
    column.classList.add('column');
    column.classList.add(`index${i}`);
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

grid.addEventListener('click', e => {
  const cell = e.target;
  instrument.toggleCell(cell.dataset.col, cell.dataset.row);
  if (cell.classList.contains('on')) {
    cell.classList.remove('on');
  } else {
    cell.classList.add('on');
  }
});

playPauseButton.addEventListener('click', e => {
  if (e.target.innerText === 'start') {
    e.target.innerText = 'stop';
    instrument.startSequence();
  } else {
    e.target.innerText = 'start';
    instrument.stopSequence();
  }
});

clearButton.addEventListener('click', () => {
  console.log('grid', grid);
  instrument.clear();
});
