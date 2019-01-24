const preReponse = require('./pre-reponse');

module.exports = server => {
  server.ext('onPreResponse', preReponse);
};
