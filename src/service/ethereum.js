const path = require('path');
const hdkey = require('ethereumjs-wallet/hdkey');
const Tx = require('ethereumjs-tx');
const Web3 = require('web3');
const EthereumUtil = require('ethereumjs-util');
const sleep = require('await-sleep')

require('dotenv').config({
  path: path.join(__dirname, '../../../.env')
});

const checkInterval = 10000;
const checkTries = 6;
const rootIndex = 0;
const xPrivateKey = process.env.X_PRI_KEY;
const hdwallet = hdkey.fromExtendedKey(xPrivateKey);

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.ETH_RPC_HOST)
);

const getAddress = index => {
  return hdwallet
    .deriveChild(index)
    .getWallet()
    .getChecksumAddressString();
};

const sendTransaction = async (options = {}) => {
  try {
    const gasPrice = web3.utils.toHex(process.env.GAS_PRICE);
    const gasLimit = web3.utils.toHex(process.env.GAS_LIMIT);
    const from = getRootAddress();
    const { to, amount } = options;
    let { amountWei } = options;

    amountWei = amountWei || web3.utils.toWei(amount, 'ether');

    const nonce = await web3.eth.getTransactionCount(from);
    const rawTx = {
      from: from,
      to: to,
      value: web3.utils.toHex(amountWei),
      nonce: web3.utils.toHex(nonce),
      gasPrice,
      gasLimit
    };

    const tx = new Tx(rawTx);
    const wallet = hdwallet.deriveChild(rootIndex).getWallet();

    tx.sign(wallet.getPrivateKey());

    if (!tx.validate()) {
      throw new Error('Invalid transaction signature');
    }

    const txId = EthereumUtil.addHexPrefix(tx.hash().toString('hex'));
    const serializedTransaction = EthereumUtil.bufferToHex(tx.serialize());
    let result = await broadcastTransaction(serializedTransaction);

    if (_.isNull(result)) {
      result = await waitForMined(txId);
    }

    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

//Private function
const getRootAddress = () => {
  return hdwallet
    .deriveChild(rootIndex)
    .getWallet()
    .getChecksumAddressString();
};

const broadcastTransaction = async serializedTransaction => {
  try {
    return await web3.eth.sendSignedTransaction(
      EthereumUtil.addHexPrefix(serializedTransaction)
    );
  } catch (error) {
    if (error.message.indexOf('Transaction was not mined') > -1) {
      return null;
    }

    throw error;
  }
};

const waitForMined = async txId => {
  let retryCounter = 0;

  while (retryCounter < checkTries) {
    const tx = await web3.eth.getTransactionReceipt(txId);
    if (_.isNull(tx)) {
      retryCounter++;
      await sleep(checkInterval)
      continue;
    }

    return tx;
  }

  throw new Error('Transaction was not mined');
};

module.exports = {
  getAddress,
  sendTransaction
};
