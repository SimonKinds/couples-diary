module.exports = {
  entry: './src/app.jsx',
  output: {filename: './build/bundle.js'},
  module: {
    loaders: [{
      test: /\.js$|\.jsx$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      query: {presets: ['env', 'react']}
    }]
  },
  resolve: {extensions: ['.js', '.jsx']},
  watch: true,
  node: {
    net: 'empty',
    dns: 'empty'
  }
};