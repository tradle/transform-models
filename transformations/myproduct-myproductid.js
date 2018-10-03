
module.exports = {
  name: 'tradle.MyProduct.myProductId',
  transform: model => {
    if (model.subClassOf === 'tradle.MyProduct' && !model.properties.myProductId) {
      model.properties.myProductId = {
        type: 'string',
      }
    }

    return model
  }
}
