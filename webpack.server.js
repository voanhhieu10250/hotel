const path = require('path');

module.exports = {
  mode: 'production',

  entry: ['./server.js'],

  target: 'node',

  output: {
    path: path.resolve('server-build'),
    filename: 'server.js',
  },

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
