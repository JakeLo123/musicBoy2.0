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

function appendMeasures(someGrid, width) {
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
    for (let j = 0; j < 12; ++j) {
      let cell = document.createElement('div');
      cell.dataset.row = j;
      cell.dataset.col = i;
      cell.classList.add('cell');
      column.append(cell);
    }
    someGrid.append(column);
  }
}

module.exports = { appendMeasures, clearAllCellsFromGrid };
