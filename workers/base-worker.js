const amqp = require('amqplib');
let config = require('../config');

// @abstract
class BaseWorker {
  start() {
    console.log(this.name + ' STARTED');

    amqp.connect(config.rabbitUrl)
      .then(connection => {
        return connection.createChannel();
      })
      .then(channel => {
        this.onStarted(channel, 1);
      })
      .catch(err => {
        console.log(err, 'Error in ' + this.name);
      });
  }

  // @virtual
  onStarted(channel, flag) {

  }
}

module.exports = BaseWorker;