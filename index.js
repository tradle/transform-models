const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const cloneDeep = require('lodash/cloneDeep')
const isEqual = require('lodash/isEqual')

const listFilesInDir = dir => fs.readdirSync(dir).map(file => path.resolve(dir, file))
const listJsonFilesInDir = dir => listFilesInDir(dir).filter(f => f.endsWith('.json'))
const read = promisify(fs.readFile.bind(fs))
const readJSON = filePath => read(filePath).then(buf => JSON.parse(buf))
const write = promisify(fs.writeFile.bind(fs))
const writeJSON = (filePath, value) => write(filePath, JSON.stringify(value, null, 2))

const transformOne = async ({ filePath, transform }) => {
  const model = await readJSON(filePath)
  const updated = transform(cloneDeep(model))
  if (!isEqual(updated, model)) {
    await writeJSON(filePath, updated)
    return true
  }
}

const transform = async ({ dir, transform }) => {
  const paths = listJsonFilesInDir(dir)
  const results = await Promise.all(paths.map(filePath => transformOne({ filePath, transform })))
  // return which ones changed
  return results
    .map((changed, i) => changed && paths[i])
    .filter(filePath => filePath)
}

module.exports = {
  transform,
}
