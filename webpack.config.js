var path = require('path');
var SRC_DIR = path.join(__dirname, '/react-client/src');
var DIST_DIR = path.join(__dirname, '/react-client/dist');


module.exports = {
  entry: {
    app: path.join(__dirname, '/react-client/src/index.jsx'),
    signup: path.join(__dirname, '/react-client/src/Signup.jsx'),
  },
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
      },
      {
        test: [/\.css$/],
        use: ['style-loader', 'css-loader']
      },
      {
        test: [/\.jpg$/, /\.png$/, /\.jpeg$/],
        use: ['file-loader']
      }
    ]
  },
   output: {
    filename: '[name].js',
    path: __dirname + '/react-client/dist'
  }

};

/**
 *   entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  }
 */

//console.log(__dirname);