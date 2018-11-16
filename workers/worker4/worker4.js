/**
 * @file describe class for Worker 4.
 */

const request = require('request');
let BaseWorker = require('../base-worker');
let config = require('../../config');

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
      case 'api':
        request({
          method: 'POST',
          url: config.api.postResult,
          body: JSON.parse({
            _id: data._id,
            url: data.url,
            lastPing: data.lastPing,
            newOptions: {
              statusContent: data.newOptions.statusContent,
              sizeContent: data.newOptions.sizeContent,
              delayContent: data.newOptions.delayContent
            }
          })
        });
        break;
      case 'other':
        break;
    }
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}

module.exports = NotifyWorker;