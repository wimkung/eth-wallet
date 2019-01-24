const accountRoute = require('../modules/account/route');

const router = server => {
  server.route({
    method: 'GET',
    path: '/',
    handler: function(request, h) {
      return 'Hapi Sequelize Starter Kit!';
    }
  });

  accountRoute(server);
};

module.exports = router;
