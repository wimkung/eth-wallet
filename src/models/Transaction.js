const findOrCreate = require('findorcreate-promise')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TransactionSchema = new Schema(
  {
    txId: {
      type: String,
      required: true
    },
    symbol: {
      type: String,
      required: true
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: 'addresses'
    },
    amount: {
      type: Schema.Types.Decimal128,
      required: true
    },
    meta: Object,
    status: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

TransactionSchema.plugin(findOrCreate)

module.exports = mongoose.model('transactions', TransactionSchema)
