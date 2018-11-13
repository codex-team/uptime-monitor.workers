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
   * Call to RabbitMQ
   * Assert previous queue
   * @param {object} channel - rabbit channel
   */
  assertPrevQueue(channel) {
    return channel.assertQueue(this.queuePrev);
  }

  /**
   * Call to RabbitMQ
   * Assert next queue
   * @param {object} channel - rabbit channel
   */
  assertNextQueue(channel) {
    return channel.assertQueue(this.queueNext);
  }

  /**
   * Call to RabbitMQ
   * Send message to next queue
   * @param {object} channel - rabbit channel
   * @param {Buffer} message - message in bytes view
   */
  sendToNextQueue(channel, message) {
    return channel.sendToQueue(this.queueNext, message);
  }

  /**
   * Call to RabbitMQ
   * Ask message
   * @param {object} channel - rabbit channel
   * @param {Buffer} message - message in bytes view
   */
  ack(channel, message) {
    return channel.ack(message);
  }

  /**
   * Call to RabbitMQ
   * Subscribe to previous queue
   * @param {object} channel - rabbit channel
   */
  subscribePrev(channel, callback) {
    return channel.consume(this.queuePrev, (msg) => {
      callback(msg);
      this.ack(channel, msg);
    });
  }

  /**
   * Run after worker started.
   * @virtual
   * @param {object} channel - rabbit channel
   */
  onStarted(channel) { }
}

module.exports = BaseWorker;
