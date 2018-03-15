const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

const path = require('path');

const config = {
  entry: {
    mqtt_ez: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        mqtt_ez: {
          chunks: "all",
          minChunks: 2
        },
        vendor: {
          test: /node_modules/,
          chunks: "all",
          name: "vendor",
          priority: 10,
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
        // use: [
        //   { loader: "style-loader" },
        //   {
        //     loader: "css-loader",
        //     options: {
        //       modules: true
        //     }
        //   }
        // ]

      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './public/index.html'}),
    new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: "[name].bundle.css"
        }),
    new webpack.LoaderOptionsPlugin({minimize: false})
  ]
};

module.exports = config;
