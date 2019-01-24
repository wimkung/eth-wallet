// middleware authentication

const strategy = server => {
  server.register(require('hapi-auth-jwt2'));
  server.auth.strategy('jwt2', 'jwt', {
    key: [process.env.JWT_SECRET],
    mode: 'optional',
    validate: async (credentials, request) => {
      return {
        isValid: true,
        credentials
      };
    }
  });
};

// adding scope or role you want to have

const authAdmin = {
  scope: 'admin'
};

const notAuth = false;

const auth = {};

module.exports = {
  strategy,
  authAdmin,
  notAuth,
  auth
};
