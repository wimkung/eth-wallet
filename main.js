const hdkey = require('ethereumjs-wallet/hdkey');
require('dotenv').config();

(() => {
  const xPrivateKey = process.env.X_PRI_KEY
  const hdwallet = hdkey.fromExtendedKey(xPrivateKey)

  console.log(hdwallet.deriveChild(0).getWallet().getAddressString())
})()