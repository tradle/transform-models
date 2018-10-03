
module.exports = {
  name: 'tradle.MyProduct.owner',
  transform: model => {
    if (model.subClassOf === 'tradle.MyProduct' && !model.properties.owner) {
      model.properties.owner = {
        type: 'object',
        ref: 'tradle.Identity',
      }
    }

    return model
  }
}
