module.exports = (shipit) => {
    require('shipit-deploy')(shipit)
    require('shipit-shared')(shipit)
    const config = require('./shipit/config')
  
    shipit.initConfig({
      default: {
        workspace: 'shipit/workspace',
        keepReleases: 2,
        deleteOnRollback: false,
        ignores: ['.git', 'node_modules', 'shipit', 'shipitfile.js'],
        repositoryUrl: 'git@github.com:20Scoops-CNX/hapi-sequelize-starter.git',
        shared: {
          overwrite: true,
          dirs: ['public', 'node_modules', 'log'],
          files: ['.env']
        }
      },
      staging: {
        servers: 'user@staging-server',
        key: config.staging.key || '~/.ssh/private_key',
        deployTo: '/your/deploy/path',
        branch: 'staging'
      },
      dev: {
        servers: 'user@dev-server',
        key: config.dev.key || '~/.ssh/private_key',
        deployTo: '/your/deploy/path',
        branch: 'dev'
      },
      production: {
        servers: 'user@product-server',
        key: config.production.key || '~/.ssh/private_key',
        deployTo: '/your/deploy/path',
        branch: 'master'
      }
    })
  
    shipit.on('sharedEnd', () => shipit.start('setup'))
    shipit.blTask('setup', function () {
      return Promise.resolve()
        .then(() => shipit.remote(`npm install --production`, { cwd: shipit.releasePath }))
    })
  
    shipit.on('deployed', () => shipit.start('pm2'))
    shipit.blTask('pm2', function () {
      const pm2Name = config[shipit.environment].pm2_name
      if (!pm2Name)
        throw new Error('No pm2_name present in shipit configuration')
      return Promise.resolve()
        .then(() => shipit.remote(`pm2 id ${pm2Name}`))
        .then(res => {
          if (res[0].stdout.trim() == '[]') {
            console.log('Start pm2 : ' + pm2Name)
            return shipit.remote(`pm2 start ${shipit.currentPath}/src/ --name ${pm2Name}`)
          } else {
            console.log('Restart pm2 : ' + pm2Name)
            return shipit.remote(`pm2 restart ${pm2Name}`)
          }
        })
    })
  }