/**
 * @file Describe class BaseWorker.
 * @author dyadyaJora
 */

const amqp = require('amqplib');
let config = require('../config');

/**
 *  Class repesentation a BaseWorker
 *  @class BaseWorker
 *  @abstract
 */
class BaseWorker {
  /**
   * Create a worker.
   * @param {string} name - worker name.
   * @param {number} index - workers serial number.
   * @param {string} queuePrev - previous queue in workers chain.
   * @param {string} queueNext - next queue in workers chain.
   */
  constructor(name, index, queuePrev, queueNext) {
    this.name = name || null;
    this.index = index || null;
    this.queuePrev = queuePrev || null;
    this.queueNext = queueNext || null;
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
