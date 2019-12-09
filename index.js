const Instrument = require('./instrument');
const Drums = require('./drums');
const Tone = require('tone');
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
    Tone.Transport.start();
    instrument.startSequence();
    drums.startSequences();
  } else {
    e.target.innerText = 'start';
    Tone.Transport.pause();
    instrument.stopSequence();
    drums.stopSequences();
  }
});

// CLEAR
clearButton.addEventListener('click', () => {
  Tone.Transport.pause();
  instrument.clear(grid.children.length);
  drums.clear(grid.children.length);
  clearAllCellsFromGrid(grid);
  clearAllCellsFromGrid(drumGrid);
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

  addColumnsToGrid(grid, 4, 12);
  addColumnsToGrid(drumGrid, 4, 3);

  instrument.addColumnsToGrid(4);
  drums.addColumnsToGrid(4);
});

// REMOVE MEASURE
removeMeasureButton.addEventListener('click', e => {
  timeoutButton(e.target, 240);

  if (grid.children.length <= 4) {
    kick.triggerAttackRelease('A1', '8n');
    e.target.disabled = true;
  } else {
    instrument.removeColumnsFromGrid(4);
    drums.removeColumnsFromGrid(4);
    for (let i = grid.children.length - 4; i < grid.children.length; ++i) {
      const columnsToBeRemoved = document.querySelectorAll(`.column.index${i}`);
      columnsToBeRemoved.forEach(column => column.classList.add('fly-away'));
    }
    setTimeout(() => {
      removeColumnsFromGrid(grid, 4);
      removeColumnsFromGrid(drumGrid, 4);
    }, 400);
  }
});
