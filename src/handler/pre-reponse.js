const onPreResponse = (request, h, err) => {
  const response = request.response;
  if (!response.isBoom) {
    return h.continue;
  }
  return h.continue;
  // for custom response in this location
};

module.exports = onPreResponse;
