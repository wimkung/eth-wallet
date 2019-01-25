const _ = require('lodash');
const path = require('path');
const Web3 = require('web3');
const moment = require('moment');
const sleep = require('await-sleep');
const Address = require('../../models/Address');
const Transaction = require('../../models/Transaction');
const Configuration = require('../../models/Configuration');

require('dotenv').config({
  path: path.join(__dirname, '../../.env')
});

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.ETH_RPC_HOST)
);

module.exports = async () => {
  let safeState = await Configuration.findOne({
    symbol: 'ETH',
    key: 'block_height'
  });
  let networkState = await getNetworkState();
  let blockHeight = safeState.value;
  do {
    try {
      if (blockHeight <= networkState) {
        console.log(`ETH #${blockHeight} --> #${networkState}`);
        const tx = await getTransactionFromBlock(blockHeight);
        const filterTx = await filterTransaction(tx);
        const confirmTransactions = await upDateConfirm(blockHeight);
        const newTransactions = await saveTransaction(filterTx);

        const transactions = {
          ...confirmTransactions,
          new: newTransactions
        };

        console.log(transactions);

        safeState.value = blockHeight++;
        // await safeState.save()
      } else {
        console.log('ETH synced..');
        await sleep(process.env.ETH_INTERVAL || 15000);
      }

      networkState = await web3.eth.getBlockNumber();
    } catch (e) {
      console.log(e);
      return 0;
    }
    break;
  } while (blockHeight <= networkState + 1);

  console.log('ETH watcher stopped');
};

const getNetworkState = async () => {
  return await web3.eth.getBlockNumber();
};

const getTransactionFromBlock = async (blockHeight = 0) => {
  let block;

  try {
    block = await web3.eth.getBlock(blockHeight, true);
  } catch (e) {
    throw e;
  }

  if (_.isNull(block)) {
    console.log(`Block #${blockHeight} is null`);
    return null;
  }

  return _.map(block.transactions, tx => {
    return {
      txId: tx.hash,
      symbol: 'ETH',
      to: tx.to ? web3.utils.toChecksumAddress(tx.to) : undefined,
      amount: web3.utils.fromWei(tx.value, 'ether'),
      meta: {
        in: blockHeight,
        txTime: moment.unix(block.timestamp)
      }
    };
  });
};

const filterTransaction = async txs => {
  const addresses = _.map(
    await Address.find({ symbol: 'ETH' }).select('address -_id'),
    item => item.address
  );
  return _.filter(txs, item => addresses.includes(item.to));
};

const saveTransaction = async txs => {
  return await Promise.all(
    _.map(txs, async tx => {
      const address = await Address.findOne({ address: tx.to });
      let transaction = await Transaction.findOne({ txId: tx.txId });
      transaction = transaction
        ? transaction
        : await Transaction.create({ ...tx, address: address._id });
      return transaction;
    })
  );
};

const upDateConfirm = async blockHeight => {
  const txs = _.filter(
    await Transaction.find({ status: 0, symbol: 'ETH' }),
    tx => tx.meta.in + tx.confirm === blockHeight
  );
  const updatedTxs = await Promise.all(
    _.map(txs, async tx => {
      tx.confirm++;
      if (tx.confirm >= (process.env.BLOCK_CONFIRM || 6)) {
        tx.status = 1;
      }
      await tx.save();
      return tx;
    })
  );
  const unAccept = _.filter(
    updatedTxs,
    tx => tx.confirm < (process.env.BLOCK_CONFIRM || 6)
  );
  const accept = _.filter(updatedTxs, tx => tx.status === 1);

  return { unAccept, accept };
};
