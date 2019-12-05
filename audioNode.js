class AudioNode {
  constructor(row, col, pitch) {
    this.row = row;
    this.col = col;
    this.pitch = pitch;
    this.status = false;
  }
}

module.exports = AudioNode;
