const boom = require('boom');

// example middleware
const getDeviceHeader = (request, h) => {
  const { device } = request.headers;
  if (!device) {
    return boom.badRequest('device header is required.');
  }
  return { device };
};

module.exports = {
  getDeviceHeader
};
