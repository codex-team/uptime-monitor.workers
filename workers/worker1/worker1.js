/**
 * @file describe class for Worker 0.
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
   */
  onStarted(channel, flag) {
    channel.assertQueue(this.prevQueue);
    // TODO: in future for scaling
    // channel.prefetch(1);
    channel.consume(this.prevQueue, (msg) => {
      channel.ack(msg);
      // ====================
      // * DO foreach projects - check delay - create new queue
      // ====================
      // * channel.assertQueue(this.queue);
      // * channel.sendToQueue(this.queue, msg);
      // ====================
    });
  }
}

module.exports = PreRequestWorker;