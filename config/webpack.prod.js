const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin') //installed via npm
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const DelWebpackPlugin = require('del-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const buildPath = path.resolve(__dirname, '../', 'dist')

module.exports = {
  devtool: false,
  entry: './src/index.js',
  stats: 'minimal',
  output: {
    filename: '[name].[hash:20].js',
    path: buildPath
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.(scss|css|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            // translates CSS into CommonJS
            loader: 'css-loader',
            options: {
              sourceMap: false
            }
          },
          {
            // Runs compiled CSS through postcss for vendor prefixing
            loader: 'postcss-loader',
            options: {
              sourceMap: false
            }
          },
          {
            // compiles Sass to CSS
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: false,
              sourceMapContents: false
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|mp4)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      title: 'Banner',
      inject: 'body'
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].css'
    }),
    new DelWebpackPlugin({
      include: ['*.map'],
      info: true,
      keepGeneratedAssets: false,
      allowExternal: false
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        map: {
          inline: false
        },
        discardComments: {
          removeAll: true
        }
      },
      canPrint: true
    }),
    new CopyPlugin([
      { from: path.resolve('src', 'assets'), to: buildPath + '/assets' }
    ])
  ]
}
