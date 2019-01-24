const findOrCreate = require('findorcreate-promise')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConfigurationSchema = new Schema(
  {
    key: {
      type: String,
      required: true
    },
    symbol: {
      type: String,
      required: true
    },
    value: {
      type: Schema.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: false
  }
);

ConfigurationSchema.plugin(findOrCreate)

module.exports = mongoose.model('configurations', ConfigurationSchema)
