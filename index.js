const Instrument = require('./instrument');
const { clearAllCellsFromGrid } = require('./utils');

const initialGridWidth = 4;

const grid = document.getElementById('grid');
const playPauseButton = document.getElementById('play-pause');
const clearButton = document.getElementById('clear');
const setTempo = document.getElementById('tempo');
const addMeasureButton = document.querySelector('.plus');
const removeMeasureButton = document.querySelector('.minus');
const instrument = new Instrument(initialGridWidth);

function initializeGrid(width) {
  let lightOrDark = false;
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
    for (let j = 0; j < 12; ++j) {
      let cell = document.createElement('div');
      cell.dataset.row = j;
      cell.dataset.col = i;
      cell.classList.add('cell');
      column.append(cell);
    }
    grid.append(column);
  }
}

initializeGrid(initialGridWidth);

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
  instrument.width = grid.children.length;
  instrument.clear();
  clearAllCellsFromGrid(grid);
  playPauseButton.innerText = 'start';
});

setTempo.addEventListener('change', e => {
  instrument.setTempo(e.target.value);
});

addMeasureButton.addEventListener('click', () => {
  let columnIndex = grid.children.length - 1;
  let lightOrDark = grid.children.length % 8 === 0;
  for (let i = 0; i < 4; ++i) {
    let column = document.createElement('div');
    column.classList.add('column');
    column.classList.add(lightOrDark ? 'light' : 'dark');
    column.classList.add(`index${columnIndex + 1}`);
    ++columnIndex;
    for (let j = 0; j < 12; ++j) {
      let cell = document.createElement('div');
      cell.dataset.row = j;
      cell.dataset.col = columnIndex;
      cell.classList.add('cell');
      column.append(cell);
    }
    grid.append(column);
  }
  instrument.addMeasure();
});

removeMeasureButton.addEventListener('click', () => {
  console.log('remove button was clicked');
});
