var path = require('path');

module.exports = {
  entry:
  {
    javascript: path.join(__dirname, './app/main.js'),
    //html: path.resolve(__dirname, './view/index.html')
  },
  output: {
    path: path.join(__dirname, './build'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
     {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {presets: ['react', 'es2015']}  
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {presets: ['react', 'es2015']}  
      },
      /*
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel?presets[]=es2015,presets[]=react']//,presets[]=stage-0,plugins[]=transform-runtime 'react-hot', 
      },
      */
      {
        test: /\.html$/,
        //exclude: /view/,
        loader: "file?name=[name].[ext]"
      }
    ]
  }
};