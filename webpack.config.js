module.exports = {
  entry: './src/app.jsx',
  output: {filename: './public/bundle.js'},
  module: {
    loaders: [{
      test: /\.js$|\.jsx$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      query: {presets: ['es2015', 'react']}
    }]
  },
  watch: true
};
