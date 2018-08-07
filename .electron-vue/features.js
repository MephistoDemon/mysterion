'use strict'

const fs = require('fs')
const path = require('path')

const getFeatureFilePath = (fileName) => path.join(__dirname, '../', fileName)

const getFeaturesFromFile = function (file) {
  const path = getFeatureFilePath(file)
  if (!fs.existsSync(path)) {
    return null
  }

  try {
    return JSON.parse(fs.readFileSync(path))
  } catch (e) {
  }

  return null
}

const productionFeatures = getFeaturesFromFile('features.prod.json')
const localFeatures = getFeaturesFromFile('features.json')

if (!productionFeatures) {
  throw new Error('Failed to read features.prod.json. This file is required for building.')
}

const features = Object.assign(productionFeatures, localFeatures)

module.exports = features
