let config;

if (process.env.NODE_ENV == 'production') {
  config = require('./config.prod');
} else if (process.env.NODE_ENV == 'test') {
  config = require('./config.test');
} else {
  config = require('./config.local');
}

module.exports = config;