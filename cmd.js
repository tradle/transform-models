#!/usr/bin/env node

const Transformer = require('./')
const transformations = require('./transformations')
const {
  help,
  list,
  transformation,
  dir,
} = require('minimist')(process.argv.slice(2), {
  alias: {
    h: 'help',
    l: 'list',
    t: 'transformation',
    d: 'dir',
  },
  boolean: ['list'],
})

const printUsage = () => console.log(`
  Usage:
    transform-models -h

  List transformations:
    transform-models -l

  Apply transformation:
    transform-models -t "[transformation-name]" -d /path/to/models/
`)

if (help) {
  printUsage()
  process.exit(0)
}

if (list) {
  const names = Object.keys(transformations)
  console.log(`Transformations:

${names.join('\n')}`)
  process.exit(0)
}

;(async () => {
  if (!(dir && transformation)) {
    throw new Error('expected strings "dir" and "transformation"')
  }

  const transform = transformations[transformation]
  if (!transform) {
    throw new Error(`transformation "${transformation}" not found`)
  }

  const changed = await Transformer.transform({ dir, transform })
  if (!changed.length) {
    console.log('no changes were necessary')
    return
  }

  console.log(`changed:

${changed.join('\n')}`)
})().catch(err => {
  console.error(err.message)
  printUsage()
  process.exit(1)
})
