/**
 * @file describe class for Worker 0.
 * @author dyadyaJora
 */

let BaseWorker = require('../base-worker');

/** Class repesentation a PreRequestWorker - Worker1
 *  @class PreRequestWorker
 *  @extends BaseWorker
 */
class PreRequestWorker extends BaseWorker {
  /**
   * Create a worker 0.
   */
  constructor() {
    super();
    this.name = 'PreRequestWorker';
    this.index = 1;
    this.queue = 'request';
    this.prevQueue = 'init';
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