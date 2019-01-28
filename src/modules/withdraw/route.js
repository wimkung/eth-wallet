const Joi = require('joi')
const { newTransaction } = require('./controller')

const routers = server => {
  server.route({
    method: 'POST',
    path: '/withdraw',
    options: {
      handler: newTransaction,
      description: 'New transfer transaction',
      tags: ['api', 'Transaction'], // ADD THIS TAG
      validate: {
        payload: {
          symbol : Joi.string().required(),
          to : Joi.string().required(),
          amount : Joi.string().required(),
        }
      }
    }
  })
}

module.exports = routers