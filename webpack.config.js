const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: path.resolve(__dirname, 'src/main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'), // string
    filename: 'frame-by-frame-animation.js', // string
    library: 'FrameAnimation'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          /(node_modules|bower_components)/,
          /@babel(?:\/|\\{1,2})runtime|core-js/
        ],
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
    ],
  }
};
