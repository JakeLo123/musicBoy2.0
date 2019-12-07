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

module.exports = { clearAllCellsFromGrid };
