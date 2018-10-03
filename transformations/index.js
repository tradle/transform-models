const fs = require('fs')
const path = require('path')
const { delimiter } = require('../constants')

const here = path.resolve(__dirname)
const transformations = {}
fs.readdirSync(here).forEach(file => {
  if (file === 'index.js') return

  const absPath = path.resolve(here, file)
  const { name, transform } = require(absPath)
  if (typeof name !== 'string') {
    throw new Error(`expected transformation to have string "name": ${absPath}`)
  }

  if (delimiter.test(name)) {
    throw new Error(`transformation name must not characters ${delimiter.toString()}: ${absPath}`)
  }

  if (typeof transform !== 'function') {
    throw new Error(`expected transformation to have function "transform": ${absPath}`)
  }

  transformations[name] = transform
})

module.exports = transformations
