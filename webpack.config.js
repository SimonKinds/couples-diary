const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: ['react-hot-loader/patch', './src/client/index.js'],
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://127.0.0.1:3000',
    },
  },
};
