const path = require('path');

module.exports = {
  mode: 'production',
  node: {
    fs: 'empty',
  },
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  performance: { hints: false },
};
