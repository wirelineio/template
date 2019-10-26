//
// Copyright 2020 Wireline, Inc.
//

const ip = require('ip');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const VersionFile = require('webpack-version-file-plugin');

const dotenv = process.env.DOTENV || '.env.localhost';
console.log(`DOTENV:  ${dotenv} \n`);

const ipAddress = (assigned) => {
  return assigned ? ip.address() : '127.0.0.1';
};

module.exports = {
  target: 'web',

  stats: 'errors-only',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  node: {
    fs: 'empty',
    tls: 'empty',
    net: 'empty',
    child_process: 'empty'
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 600
    }
  },

  // https://www.npmjs.com/package/html-webpack-plugin
  plugins: [
    new HtmlWebPackPlugin({
      filename: 'index.html',
      template: './assets/index.html',
      favicon: './assets/favicon.ico'
    }),

    // TODO(burdon): ./.env.defaults.
    // https://www.npmjs.com/package/dotenv-webpack#properties
    new Dotenv({
      path: dotenv
    }),

    new VersionFile({
      packageFile: path.join(__dirname, 'package.json'),
      outputFile: path.join(__dirname, 'src/version.json')
    }),

    // TODO(burdon): Make optional by switch.
    // https://webpack.js.org/plugins/define-plugin#usage
    new webpack.DefinePlugin({
      '__LOCALHOST__': process.env.NODE_ENV === 'development' ? JSON.stringify(ipAddress()) : JSON.stringify('')
    }),

    // Ignore require() calls in vs/language/typescript/lib/typescriptServices.js
    new webpack.IgnorePlugin(
      /vs(\/|\\)language(\/|\\)typescript(\/|\\)lib/
    ),

    new CopyWebpackPlugin(['assets']),

    // Service worker for offline.
    process.env.NODE_ENV !== 'development' && new OfflinePlugin({
      autoUpdate: true,
      responseStrategy: 'network-first'
    })
  ].filter(Boolean),

  module: {
    // Avoid warning from webpack when require has an expression.
    // Which is the case for requiring handlers dynamically.
    exprContextCritical: false,

    rules: [
      // js/mjs
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },

      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },

      // css
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },

      // fonts
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },

  resolve: {
    alias: {
      'react': path.resolve(__dirname, '..', '..', 'node_modules/react'),
      'react-dom': path.resolve(__dirname, '..', '..', 'node_modules/react-dom'),
      '@apollo/react-hooks': path.resolve(__dirname, '..', '..', 'node_modules/@apollo/react-hooks')
    }
  }
};
