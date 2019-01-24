const findOrCreate = require('findorcreate-promise')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AddressSchema = new Schema(
  {
    symbol: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      default: 0
    },
    address: {
      type: String,
      unique: true,
      index: true,
      required: true
    },
    user: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

AddressSchema.plugin(findOrCreate)

module.exports = mongoose.model('addresses', AddressSchema)
