'use strict';

const hapi = require('hapi');
const path = require('path');
const mongodb = require('./database');

require('dotenv').config({
  path: path.join(__dirname, '../.env')
});

const router = require('./routes');
const handler = require('./handler');
const plugin = require('./plugins');
const worker = require('./worker');
const seed = require('./seed/configuration');

const server = hapi.server({
  port: process.env.SERVER_PORT,
  host: process.env.SERVER_HOST,
  debug: {
    log: ['*']
  }
});

const init = async () => {
  await mongodb();
  await plugin(server)
  await router(server);
  await handler(server);
  await server.start();
  console.log(`Server running at : ${server.info.uri}`);

  await seed();
  worker();

};

server.events.on('log', (event, tags) => {
  console.log(tags);
});

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
