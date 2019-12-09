const path = require('path');

module.exports = {
  mode: 'production',
  node: {
    fs: 'empty',
  },
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  performance: { hints: false },
};
