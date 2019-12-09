const Instrument = require('./instrument');
const Drums = require('./drums');
const { kick } = require('./sounds/synth');
const {
  initializeGrid,
  clearAllCellsFromGrid,
  timeoutButton,
  toggleCell,
  addColumnsToGrid,
  removeColumnsFromGrid,
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
});

// PLAY - PAUSE
playPauseButton.addEventListener('click', e => {
  if (e.target.innerText === 'start') {
    e.target.innerText = 'stop';
    instrument.startSequence();
    drums.startSequences();
  } else {
    e.target.innerText = 'start';
    instrument.stopSequence();
    drums.stopSequences();
  }
});

// CLEAR
clearButton.addEventListener('click', () => {
  instrument.clear();
  clearAllCellsFromGrid(grid);
  playPauseButton.innerText = 'start';
});

// SET TEMPO
setTempo.addEventListener('change', e => {
  instrument.setTempo(e.target.value * 2);
});

// ADD MEASURE
addMeasureButton.addEventListener('click', e => {
  timeoutButton(e.target, 240);
  if (grid.children.length >= 4) removeMeasureButton.disabled = false;

  instrument.addColumnsToGrid(4);
  drums.addColumnsToGrid(4);

  addColumnsToGrid(grid, 4, 12);
  addColumnsToGrid(drumGrid, 4, 3);
});

// REMOVE MEASURE
removeMeasureButton.addEventListener('click', e => {
  timeoutButton(e.target, 240);

  if (grid.children.length <= 4) {
    kick.triggerAttackRelease('A1', '8n');
    e.target.disabled = true;
  } else {
    instrument.removeColumnsFromGrid(4);
    removeColumnsFromGrid(grid, 4);
    removeColumnsFromGrid(drumGrid, 4);
  }
});
