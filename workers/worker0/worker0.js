/**
 * @file describe class for Worker 0.
 * @author dyadyaJora
 */

let BaseWorker = require('../base-worker');

/** @constant {number} delay for first worker (each one minute)*/
const QUANT_TIME = 5000;

/**
 * Class repesentation a InitWorker
 * Worker with 0 index, start worker-chain
 * @class InitWorker
 * @extends BaseWorker
 */
class InitWorker extends BaseWorker {
  /**
   * Create a worker 0.
   */
  constructor() {
    super('InitWorker', 0, null, 'init');
  }

  /**
   * Run after worker started.
   * @override
   */
  onStarted() {
    // Every minute send to queue INIT any message that would started WORKER1 again and again
    setInterval(() => {
      this.sendToNextQueue(Buffer.from('1'));
    }, QUANT_TIME);
  }
}

module.exports = InitWorker;