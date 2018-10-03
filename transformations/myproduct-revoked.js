
module.exports = {
  name: 'tradle.MyProduct.revoked',
  transform: model => {
    if (model.subClassOf === 'tradle.MyProduct' && !model.properties.revoked) {
      model.properties.revoked = {
        type: 'boolean',
      }
    }

    return model
  }
}
