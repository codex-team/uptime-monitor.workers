/**
 * @file describe class for NotifyWorker.
 */

const request = require('request-promise');
let BaseWorker = require('../base-worker');
let config = require('../../config');

/**
 * Class repesentation a NotifyWorker
 * Worker for make notify
 * @class RequestWorker
 * @extends BaseWorker
 */
class NotifyWorker extends BaseWorker {
  /**
   * Create a worker.
   */
  constructor() {
    super('NotifyWorker');
  }

  /**
   * Make some work every tick
   * Send ping result to api OR send alarm-notify
   * @override
   * @param {object} data
   * @param {string} data._id - project ID
   * @param {string} data.url - project url
   * @param {object} data.options - old project options
   * @param {number} data.options.statusContent
   * @param {number} data.options.sizeContent
   * @param {number} data.options.delayContent
   * @param {object} data.options - new received project options
   * @param {number} data.newOptions.statusContent
   * @param {number} data.newOptions.sizeContent
   * @param {number} data.newOptions.delayContent
   * @param {Array} data.notification - array with notify endpoints // @todo
   * @param {string} data.lastPing - last ping ISO time
   */
  operate(data) {
    let resultCall = new Promise((resolve, reject) => {
      resolve();
    });

    console.log('dooing task = ' + data.type);

    switch (data.type) {
      case 'api':
        // resultCall = request({
        //   method: 'POST',
        //   url: config.apiUrl.postResult,
        //   body: {
        //     _id: data._id,
        //     url: data.url,
        //     lastPing: data.lastPing,
        //     newOptions: {
        //       statusContent: data.newOptions && data.newOptions.statusContent,
        //       sizeContent: data.newOptions && data.newOptions.sizeContent,
        //       delayContent: data.newOptions && data.newOptions.delayContent
        //     }
        //   },
        //   json: true
        // });
        break;
      case 'testhook':
        resultCall = request({
          method: 'POST',
          uri: config.testhookUrl,
          form: {
            message: data.message
          }
        });
        break;
      case 'other':
        break;
    }

    return resultCall;
  }
}

module.exports = NotifyWorker;