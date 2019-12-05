function createGrid(height, width) {
  const grid = document.getElementById('grid');
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

createGrid(10, 10);
