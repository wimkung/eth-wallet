const authenMiddleware = require('./authentication');
const headerHandler = require('./headerHandler');

const authentication = server => authenMiddleware.strategy(server);

module.exports = {
  authentication,
  headerHandler
};
