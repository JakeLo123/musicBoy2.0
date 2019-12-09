const path = require('path');

module.exports = {
  mode: 'development',
  node: {
    fs: 'empty',
  },
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
};
