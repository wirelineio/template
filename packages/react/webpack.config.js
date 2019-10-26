//
// Copyright 2020 Wireline, Inc.
//

const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');

const baseConfig = require('./webpack-common.config');

module.exports = merge(baseConfig, {

  mode: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',

  // Source map shows the original source and line numbers (and works with hot loader).
  // https://webpack.github.io/docs/configuration.html#devtool
  // devtool: process.env.NODE_ENV === 'production' ? '#source-map' : 'cheap-module-source-map',
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'cheap-module-source-map',

  entry: {
    app: ['./src/main']
  },

  externals: {
    loggly: 'loggly'
  },

  optimization: {
    // Remove minimize for now. Terser breaks chessboardjsx (dist .min.js) and makes all pieces jump on move.
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [
      // This is only used in production mode
      new TerserPlugin({
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: false,
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
        // Enable file caching
        cache: true,
        sourceMap: true
      })
    ],
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      maxInitialRequests: Infinity,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return 'vendor';
          }
        }
      }
    }
  }
});
