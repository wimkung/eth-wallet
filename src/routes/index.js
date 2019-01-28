const accountRoute = require('../modules/account/route');
const withdrawRoute = require('../modules/withdraw/route');

const router = server => {
  server.route({
    method: 'GET',
    path: '/',
    handler: function(request, h) {
      return 'Hapi Sequelize Starter Kit!';
    }
  });

  accountRoute(server);
  withdrawRoute(server);
};

module.exports = router;
