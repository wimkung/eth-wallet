const ethWatcher = require('./watcher/ethereum')

module.exports = () => {
  //Block watcher
  ethWatcher()
}