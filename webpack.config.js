module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: './app/bundle.js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }]
  }
};
