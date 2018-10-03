const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const cloneDeep = require('lodash/cloneDeep')
const isEqual = require('lodash/isEqual')

const listFilesInDir = dir => fs.readdirSync(dir).map(file => path.resolve(dir, file))
const listJsonFilesInDir = dir => listFilesInDir(dir).filter(f => f.endsWith('.json'))
const write = promisify(fs.writeFile.bind(fs))

const transform = async ({ dir, transform }) => {
  const paths = listJsonFilesInDir(dir)
  const models = paths.map(modelPath => require(modelPath))
  const results = models.map(model => transform(cloneDeep(model)))
  const changed = []
  await Promise.all(results.map(async (result, i) => {
    if (!result) return
    if (isEqual(result, models[i])) {
      // no change
      return true
    }

    changed.push(result.id)
    await write(paths[i], JSON.stringify(result, null, 2))
  }))

  return changed
}

module.exports = {
  transform,
}
