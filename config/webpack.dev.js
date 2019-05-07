const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

const baseDir = path.resolve(__dirname, '../', 'src')

module.exports = {
  devtool: 'eval-cheap-module-source-map',
  entry: './src/index.js',
  devServer: {
    port: 8080,
    contentBase: baseDir,
    stats: {
      all: undefined,
      modules: false,
      assets: true
    }
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
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-class-properties']
        }
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            // creates style nodes from JS strings
            loader: 'style-loader',
            options: {
              sourceMap: true
            }
          },
          {
            // translates CSS into CommonJS
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            // compiles Sass to CSS
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: true,
              sourceMapContents: true
            }
          }
          // Please note we are not running postcss here
        ]
      },
      {
        // Load all images as base64 encoding if they are smaller than 8192 bytes
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // On development we want to see where the file is coming from, hence we preserve the [path]
              name: '[path][name].[ext]?hash=[hash:20]',
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack Starter Kit',
      inject: true,
      template: 'index.ejs'
    }),
    new BrowserSyncPlugin({
      // browse to http://localhost:3000/ during development,
      // ./public directory is being served
      host: 'localhost',
      port: 3000,
      proxy: 'http://localhost:8080/'
    })
  ]
}
