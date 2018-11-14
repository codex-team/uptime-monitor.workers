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
    super('InitWorker', 0);
  }

  /**
   * Start zero worker.
   * @override
   */
  start() {
    // Every minute send to queue INIT any message that would started WORKER1 again and again
    setInterval(() => {
      this.addTask(this.index + 1, {
        needPing: true
      });
    }, QUANT_TIME);
  }
}

module.exports = InitWorker;