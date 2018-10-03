#!/usr/bin/env node

const path = require('path')
const uniq = require('lodash/uniq')
const Transformer = require('./')
const TRANSFORMATIONS = require('./transformations')
const { delimiter } = require('./constants')
const log = (...args) => console.log(...args)
const {
  help,
  list,
  transformations,
  all,
  dir,
} = require('minimist')(process.argv.slice(2), {
  alias: {
    h: 'help',
    l: 'list',
    t: 'transformations',
    a: 'all',
    d: 'dir',
  },
  boolean: ['list'],
})

const printUsage = () => log(`
  Usage:
    transform-models -h

  List transformations:
    transform-models -l

  Apply transformations:
    transform-models -d /path/to/models/ -t "[transformation-name],[transformation-name],..."

  Apply all transformations:
    transform-models -d /path/to/models/ -a
`)

if (help) {
  printUsage()
  process.exit(0)
}

if (list) {
  const names = Object.keys(TRANSFORMATIONS)
  log(`Transformations:

${names.join('\n')}`)
  process.exit(0)
}

;(async () => {
  if (!dir) {
    throw new Error('expected string "dir"')
  }

  let names
  if (all) {
    names = Object.keys(TRANSFORMATIONS)
  } else {
    names = transformations.split(delimiter)
    names.every(name => {
      if (!TRANSFORMATIONS[name]) {
        throw new Error(`transformation "${name}" not found`)
      }
    })
  }

  let changed = []
  for (const name of names) {
    const transform = TRANSFORMATIONS[name]
    log(`applying transformation: ${name}`)
    changed = changed.concat(await Transformer.transform({ dir, transform }))
  }

  changed = uniq(changed).map(filePath => path.relative(dir, filePath))
  if (!changed.length) {
    log('no changes were necessary')
    return
  }

  log(`changed:

${changed.join('\n')}`)
})().catch(err => {
  console.error(err.stack)
  printUsage()
  process.exit(1)
})
