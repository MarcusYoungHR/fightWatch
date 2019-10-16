var path = require('path');
var SRC_DIR = path.join(__dirname, '/react-client/src');
var DIST_DIR = path.join(__dirname, '/react-client/dist');


module.exports = {
  entry: path.join(__dirname, '/react-client/src/index.jsx'),
  module: {
    rules: [
      {
        test: [/\.jsx$/],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }
      }
      // {
      //   test: [/\.css$/],
      //   use: ['style-loader', 'css-loader']
      // }
    ]
  },
   output: {
    filename: 'bundle.js',
    path: __dirname + '/react-client/dist'
  }

};

//console.log(__dirname);