function clearAllCellsFromGrid(someGrid) {
  let columns = someGrid.children;
  for (let i = 0; i < columns.length; ++i) {
    let cells = columns[i].children;
    for (let j = 0; j < cells.length; ++j) {
      let cell = cells[j];
      cell.classList.remove('on');
    }
  }
}

function timeoutButton(button, timeoutValue) {
  button.disabled = true;
  setTimeout(() => {
    button.disabled = false;
  }, timeoutValue);
}

function initializeGrid(someGrid, width, height) {
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
    for (let j = 0; j < height; ++j) {
      let cell = document.createElement('div');
      cell.dataset.row = j;
      cell.dataset.col = i;
      cell.classList.add('cell');
      column.append(cell);
    }
    someGrid.append(column);
  }
}

function addColumnsToGrid(someGrid, numColumns, height) {
  let columnIndex = someGrid.children.length - 1;
  let lightOrDark = someGrid.children.length % 8 === 0;
  for (let i = 0; i < numColumns; ++i) {
    let column = document.createElement('div');
    column.classList.add('column');
    column.classList.add(lightOrDark ? 'light' : 'dark');
    column.classList.add(`index${columnIndex + 1}`);
    ++columnIndex;
    for (let j = 0; j < height; ++j) {
      let cell = document.createElement('div');
      cell.dataset.row = j;
      cell.dataset.col = columnIndex;
      cell.classList.add('cell');
      column.append(cell);
    }
    someGrid.append(column);
  }
}

function removeColumnsFromGrid(someGrid, numColumns) {
  let columnIndex = someGrid.children.length - 1;
  for (let i = 0; i < numColumns; ++i) {
    let columnToBeRemoved = someGrid.children[columnIndex];
    someGrid.removeChild(columnToBeRemoved);
    --columnIndex;
  }
}

function toggleCell(event, instrument) {
  const cell = event.target;
  instrument.toggleCell(cell.dataset.col, cell.dataset.row);
  if (cell.classList.contains('on')) {
    cell.classList.remove('on');
  } else {
    cell.classList.add('on');
  }
}

module.exports = {
  timeoutButton,
  clearAllCellsFromGrid,
  initializeGrid,
  toggleCell,
  addColumnsToGrid,
  removeColumnsFromGrid,
};
