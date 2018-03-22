'use strict'

const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')

const baseConfig = require('../../../mysterion/.electron-vue/webpack.renderer.config')
const projectRoot = path.resolve(__dirname, '../../src/renderer')

// Set BABEL_ENV to use proper preset config
process.env.BABEL_ENV = 'test'
process.env.TEST_COVERAGE = 'false'

let webpackConfig = merge(baseConfig, {
  devtool: '#inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"testing"'
    })
  ]
})

// don't treat dependencies as externals
delete webpackConfig.entry
delete webpackConfig.externals
delete webpackConfig.output.libraryTarget

// apply vue option to apply isparta-loader on js
webpackConfig.module.rules
  .find(rule => rule.use.loader === 'vue-loader').use.options.loaders.js = 'babel-loader'

const reporters = ['spec']

module.exports = config => {
  config.set({
    browsers: ['visibleElectron'],
    client: {
      useIframe: false
    },
    customLaunchers: {
      'visibleElectron': {
        base: 'Electron',
        flags: ['']
      }
    },
    frameworks: ['mocha', 'chai'],
    files: [
      '../../test/integration/index.js'
    ],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    reporters: reporters,
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    }
  })
}
