/**
 * @file describe class for Worker 4.
 */

let BaseWorker = require('../base-worker');

/**
 * Class repesentation a NotifyWorker
 * Worker 4, Make notify
 * @class RequestWorker
 * @extends BaseWorker
 */
class NotifyWorker extends BaseWorker {
  /**
   * Create a worker 4.
   */
  constructor() {
    super('NotifyWorker', 4);
  }

  /**
   * @override
   */
  operate(data) {
    let temp;

    switch (data.type) {
      case 'api': { break; }
      case 'other': { break; }
    }
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}

module.exports = NotifyWorker;