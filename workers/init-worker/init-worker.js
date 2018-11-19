/**
 * @file describe class for InitWorker.
 */

let BaseWorker = require('../base-worker');

/** @constant {number} delay for first worker (each one minute)*/
const QUANT_TIME = 5000;

/**
 * Class repesentation a InitWorker
 * Start worker-chain
 * @class InitWorker
 * @extends BaseWorker
 */
class InitWorker extends BaseWorker {
  /**
   * Create a worker.
   */
  constructor() {
    super('InitWorker');
  }

  /**
   * Start zero worker.
   * @override
   */
  start() {
    console.log('Worker [0] started');
    // Every minute send to queue INIT any message that would started WORKER1 again and again
    setInterval(() => {
      this.addTask('PreRequestWorker', {
        needPing: true
      });
    }, QUANT_TIME);
  }
}

module.exports = InitWorker;