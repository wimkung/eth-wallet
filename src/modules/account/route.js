const Joi = require('joi')
const { newAddress } = require('./controller')

const routers = server => {
  server.route({
    method: 'POST',
    path: '/address/new',
    options: {
      handler: newAddress,
      description: 'Get new address by symbol',
      tags: ['api', 'Address'], // ADD THIS TAG
      validate: {
        payload: {
          symbol : Joi.string().required(),
        }
      }
    }
  })
}

module.exports = routers