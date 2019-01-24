const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

/**
 *
 * @param {*} userId
 * @param {*} expired minute
 */
const generateToken = (userId, expired) => {
  return jwt.sign(
    {
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + expired * 60
    },
    secret
  );
};

module.exports = {
  generateToken
};
