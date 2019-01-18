const Wallet = require('ethereumjs-wallet');
const EthUtil = require('ethereumjs-util');

(() => {
  const privateKeyString = '0x61ce8b95ca5fd6f55cd97ac60817777bdf64f1670e903758ce53efc32c3dffeb';
  const privateKeyBuffer = EthUtil.toBuffer(privateKeyString);
  const wallet = Wallet.fromPrivateKey(privateKeyBuffer);

  const publicKey = wallet.getPublicKeyString();
  console.log(publicKey);
  const address = wallet.getAddressString();
  console.log(address);
})()