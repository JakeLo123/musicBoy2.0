const Instrument = require('./instrument');
const Drums = require('./drums');
const { kick, clap, cymbal } = require('./sounds/synth');
const {
  initializeGrid,
  clearAllCellsFromGrid,
  timeoutButton,
  toggleCell,
} = require('./utils');

const initialGridWidth = 16;

const grid = document.getElementById('grid');
const drumGrid = document.getElementById('drum-grid');
const playPauseButton = document.getElementById('play-pause');
const clearButton = document.getElementById('clear');
const setTempo = document.getElementById('tempo');
const addMeasureButton = document.querySelector('.plus');
const removeMeasureButton = document.querySelector('.minus');
const instrument = new Instrument(initialGridWidth);
const drums = new Drums(initialGridWidth);

initializeGrid(grid, initialGridWidth, 12);
initializeGrid(drumGrid, initialGridWidth, 3);

grid.addEventListener('click', event => {
  toggleCell(event, instrument);
});
drumGrid.addEventListener('click', event => {
  toggleCell(event, drums);
  // console.log(event.target.dataset);
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
  instrument.clear();
  clearAllCellsFromGrid(grid);
  playPauseButton.innerText = 'start';
});

setTempo.addEventListener('change', e => {
  instrument.setTempo(e.target.value * 2);
});

addMeasureButton.addEventListener('click', e => {
  timeoutButton(e.target, 240);
  if (grid.children.length >= 4) removeMeasureButton.disabled = false;

  instrument.addColumnsToGrid(4);
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
});

removeMeasureButton.addEventListener('click', e => {
  timeoutButton(e.target, 240);

  if (grid.children.length <= 4) {
    kick.triggerAttackRelease('A1', '8n');
    e.target.disabled = true;
  } else {
    let columnIndex = grid.children.length - 1;
    instrument.removeColumnsFromGrid(4);
    for (let i = 0; i < 4; ++i) {
      let columnToBeRemoved = grid.children[columnIndex];
      grid.removeChild(columnToBeRemoved);
      --columnIndex;
    }
  }
});
