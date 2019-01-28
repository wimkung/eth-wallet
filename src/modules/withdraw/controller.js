const _ = require('lodash');
const boom = require('boom');
const ethService = require('../../service/ethereum');

const newTransaction = async (req, h) => {
  try {
    const { symbol, to, amount } = req.payload;

    const result = await ethService.sendTransaction({ to, amount })

    return result
  } catch (e) {
    return boom.badData('Symbol not found', e);
  }
};

module.exports = {
  newTransaction
};
