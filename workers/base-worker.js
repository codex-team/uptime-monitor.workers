/**
 * @file Describe class BaseWorker.
 * @author dyadyaJora
 */

const amqp = require('amqplib');
let config = require('../config');

/** Class repesentation a BaseWorker
 *  @class BaseWorker
 *  @abstract
 */
class BaseWorker {
  /**
   * Create a worker.
   * @param {string} name - worker name.
   * @param {number} index - workers serial number/
   * @param {string} queue - worker queue name.
   */
  constructor(name, index, queue) {
    this.name = null;
    this.index = null;
    this.queue = null;
  }

  /**
   * Wrapper for starting each worker
   * Create connection to amqp, create subscribers
   * Have callback - onStarted
   */
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

  /**
   * Run after worker started.
   * @virtual
   */
  onStarted(channel, flag) { }
}

module.exports = BaseWorker;
