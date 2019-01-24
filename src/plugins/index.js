const Inert = require('inert')
const Vision = require('vision')
const Pack = require('../../package')
const HapiSwagger = require('hapi-swagger')

const plugins = async server => {
  const swaggerOptions = {
    info: {
      title: 'Wallet API Documentation',
      version: Pack.version,
    },
  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ]);
}

module.exports = plugins;
