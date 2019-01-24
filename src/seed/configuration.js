const Configuration = require('../models/Configuration')

module.exports = async () => {
  console.log('Start seeder...')

  const blockHeight = await Configuration.findOrCreate(
    { symbol: 'ETH', key: 'block_height' },
    { symbol: 'ETH', key: 'block_height', value: 0 }
  )

  console.log('...Seed successfully')
}
