import Vue from 'vue'
Vue.config.devtools = false
Vue.config.productionTip = false

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
if (process.env.TEST_COVERAGE === 'true') {
  const srcContext = require.context('../../src/renderer', true, /^\.\/(?!main(\.js)?$|.*\.less$|.*\.svg$)/)
  srcContext.keys().forEach(srcContext)
}
