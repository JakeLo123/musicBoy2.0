const Instrument = require('./instrument');
const { clearAllCellsFromGrid } = require('./utils');

const grid = document.getElementById('grid');
const playPauseButton = document.getElementById('play-pause');
const clearButton = document.getElementById('clear');
const setTempo = document.getElementById('tempo');
const addMeasure = document.querySelector('.plus');
const removeMeasure = document.querySelector('.minus');
const instrument = new Instrument(16);

function createGrid(height, width) {
  let lightOrDark = true;
  let n = 0;
  for (let i = 0; i < width; ++i) {
    let column = document.createElement('div');
    if (n % 4 === 0) {
      lightOrDark = !lightOrDark;
      n = 0;
    }
    column.classList.add('column');
    column.classList.add(lightOrDark ? 'light' : 'dark');
    column.classList.add(`index${i}`);
    ++n;
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
  clearAllCellsFromGrid(grid);
  instrument.clear();
  playPauseButton.innerText = 'start';
});

setTempo.addEventListener('change', e => {
  instrument.setTempo(e.target.value);
});

addMeasure.addEventListener('click', () => {
  console.log('add button was clicked!');
});

removeMeasure.addEventListener('click', () => {
  console.log('remove button was clicked');
});
