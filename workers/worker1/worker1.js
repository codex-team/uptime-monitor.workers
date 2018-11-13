/**
 * @file describe class for Worker 1.
 * @author dyadyaJora
 */

let BaseWorker = require('../base-worker');

/**
 * Class repesentation a PreRequestWorker
 * First Worker, check lastPingTime and create queue for request
 * @class PreRequestWorker
 * @extends BaseWorker
 */
class PreRequestWorker extends BaseWorker {
  /**
   * Create a worker 1.
   */
  constructor() {
    super('PreRequestWorker', 1, 'init', 'request');
  }

  /**
   * Run after worker started.
   * @override
   * @param {object} channel - rabbit channel
   */
  onStarted(channel) {
    this.assertPrevQueue(channel);
    // TODO: in future for scaling
    // channel.prefetch(1);
    this.subscribePrev(channel, this._onMessageRecieve);
  }

  /**
   * Callback on recieve message from prev queue.
   * @param {object} msg - recieved message
   */
  _onMessageRecieve(msg) {
    console.log('recieving msg callback, msg ===', msg);
    // ====================
    // * DO foreach projects - check delay - create new queue
    // ====================
    // * channel.assertQueue(this.queue);
    // * channel.sendToQueue(this.queue, msg);
    // ====================
  }
}

module.exports = PreRequestWorker;