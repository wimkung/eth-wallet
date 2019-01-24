const path = require('path')
const hdkey = require('ethereumjs-wallet/hdkey');

require('dotenv').config({
  path: path.join(__dirname, '../../../.env')
});

const xPrivateKey = process.env.X_PRI_KEY
const hdwallet = hdkey.fromExtendedKey(xPrivateKey)

const getAddress = index => {
  return hdwallet.deriveChild(index).getWallet().getAddressString()
}

module.exports = {
  getAddress
}