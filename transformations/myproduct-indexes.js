// const createMatcher = require('lodash/matches')
const myProductIdIndex = {
  hashKey: 'myProductId',
  rangeKey: '_time',
}

const ownerIndex = {
  hashKey: 'owner._permalink',
  rangeKey: '_time',
}

const typeIndex = {
  hashKey: '_t',
  rangeKey: '_time',
}

const authorIndex = {
  hashKey: '_orgOrAuthor',
  rangeKey: ['_t', '_time'],
}

const indexes = [
  myProductIdIndex,
  ownerIndex,
  typeIndex,
  authorIndex,
]

// const matchers = indexes.map(index => createMatcher(index))

module.exports = {
  name: 'tradle.MyProduct.indexes.owner',
  transform: model => {
    if (model.subClassOf !== 'tradle.MyProduct') return model

    return {
      ...model,
      indexes,
    }
  }
}
