const _ = require('lodash');
const boom = require('boom');
const Address = require('../../models/Address');
const ethService = require('../../service/ethereum');

const newAddress = async (req, h) => {
  try {
    const symbol = req.payload.symbol;
    const lastAddress = await Address.findOne({ symbol })
      .sort({ index: -1 })
      .exec();
    const lastIndex = lastAddress ? lastAddress.index : -1;
    const index = lastIndex + 1;
    console.log({ lastIndex, index });
    let address = '';
    if (symbol === 'ETH') {
      address = ethService.getAddress(index);
    }
    const newAddress = await Address.findOrCreate({ symbol, index, address });

    return _.pick(newAddress.result, ['symbol', 'address']);
  } catch (e) {
    boom.badData('Symbol not found', e);
  }
};

module.exports = {
  newAddress
};
