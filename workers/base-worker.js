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
 *  @property {string} name - worker name.
 *  @property {number} index - workers serial number.
 *  @property {string} queuePrev - previous queue in workers chain.
 *  @property {string} queueNext - next queue in workers chain.
 *  @property {object} _channel - rabbit channel.
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
        this._channel = channel;
        this.onStarted();
      })
      .catch(err => {
        console.log(err, 'Error in ' + this.name);
      });
  }

  /**
   * Call to RabbitMQ
   * Assert previous queue
   */
  _assertPrevQueue() {
    return this.channel.assertQueue(this.queuePrev);
  }

  /**
   * Call to RabbitMQ
   * Assert next queue
   */
  _assertNextQueue() {
    return this.channel.assertQueue(this.queueNext);
  }

  /**
   * Call to RabbitMQ
   * Send message to next queue
   * @param {Buffer} message - message in bytes view
   */
  sendToNextQueue(message) {
    return this.channel._assertNextQueue()
      .then(() => {
        return this.channel.sendToQueue(this.queueNext, message);
      })
      // TODO Error Handler
      .catch((err) => {
        console.log('something went wrong', err);
      });
  }

  /**
   * Call to RabbitMQ
   * Ask message === confirm message receive
   * @param {object} message - Rabbit message
   */
  ack(message) {
    return this.channel.ack(message);
  }

  /**
   * Call to RabbitMQ
   * Subscribe to previous queue
   */
  subscribeToPrevQueue(callback) {
    return this.channel.consume(this.queuePrev, (msg) => {
      callback(msg);
      this.ack(msg);
    });
  }

  /**
   * Run after worker started.
   * @virtual
   */
  onStarted() { }
}

module.exports = BaseWorker;
