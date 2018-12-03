module.exports = {
  apps : [{
    name: 'prerequest',
    script: './workers/prerequest-worker/index.js',
    log: 'pm2-logfile.log',
    autorestart: true,
    watch: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  },
  {
    name: 'request',
    script: './workers/request-worker/index.js',
    log: 'pm2-logfile.log',
    autorestart: true,
    watch: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  },
  {
    name: 'response',
    script: './workers/response-worker/index.js',
    log: 'pm2-logfile.log',
    autorestart: true,
    watch: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  },
  {
    name: 'notify',
    script: './workers/notify-worker/index.js',
    log: 'pm2-logfile.log',
    autorestart: true,
    watch: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
