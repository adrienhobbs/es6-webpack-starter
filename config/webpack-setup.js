const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const baseDir = path.resolve(__dirname, '../', 'src')
const CleanWebpackPlugin = require('clean-webpack-plugin') //installed via npm
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const buildPath = path.resolve(__dirname, '../', 'dist')

module.exports = (env, argv) => {
  let styleRules = []
  let plugins = []
  let config = {}
  const isProd = argv.mode === 'production'

  if (env && env.sync && argv.mode === 'development') {
    plugins.push(
      new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        proxy: 'http://localhost:8080/',
        open: false
      })
    )
  }

  if (!isProd) {
    config = {
      devtool: 'eval-cheap-module-source-map',
      devServer: {
        port: 8080,
        contentBase: baseDir,
        stats: {
          all: undefined,
          modules: false,
          assets: true
        }
      }
    }
    styleRules = [
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
          sourceMap: isProd ? false : true
        }
      },
      {
        // compiles Sass to CSS
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded',
          sourceMap: isProd ? false : true,
          sourceMapContents: isProd ? false : true
        }
      }
      // Please note we are not running postcss here
    ]
  }

  if (isProd) {
    config = {
      output: {
        filename: '[name].[hash:20].js',
        path: buildPath
      },
      devtool: false,
      stats: 'minimal'
    }
    plugins = [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'styles.[contenthash].css'
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
    styleRules = [
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
  }

  return {
    ...config,
    entry: './src/index.js',
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
          use: styleRules
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
        inject: isProd ? 'body' : true,
        template: 'index.html'
      }),
      ...plugins
    ]
  }
}
