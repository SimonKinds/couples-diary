module.exports = {
  entry: './index.jsx',
  output: {filename: './build/bundle.js'},
  module: {
    loaders: [{
      test: /\.js$|\.jsx$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader'
    }]
  },
  resolve: {extensions: ['.js', '.jsx']},
  watch: true,
  node: {
    net: 'empty',
    dns: 'empty'
  }
};
