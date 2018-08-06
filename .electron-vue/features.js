'use strict'

const fs = require('fs')
const path = require('path')

const getFeatures = function (file) {
  if (!fs.existsSync(file)) {
    return null
  }

  try {
    return JSON.parse(fs.readFileSync(file))
  } catch (e) {
  }

  return null
}

const productionFeatures = getFeatures(path.join(__dirname, '../', 'features.prod.json'))
const localFeatures = getFeatures(path.join(__dirname, '../', 'features.json'))

if (!productionFeatures) {
  throw new Error('Failed to read features.prod.json. This file is required for building.')
}

const features = Object.assign(productionFeatures, localFeatures)

module.exports = features
