/**
 * @file describe class for RequestWorker.
 */

const http = require('http');
const https = require('https');
let BaseWorker = require('../base-worker');

/**
 * Class repesentation a RequestWorker
 * Second Worker, make request
 * @class RequestWorker
 * @extends BaseWorker
 */
class RequestWorker extends BaseWorker {
  /**
   * Create a worker RequestWorker.
   */
  constructor() {
    super('RequestWorker');
  }

  /**
   * Make some work every tick
   * Make http(s) request
   * @override
   * @param {object} data
   * @param {string} data._id - project ID
   * @param {string} data.url - project url
   * @param {string} data.name - project name
   * @param {object} data.options - project options
   * @param {number} data.options.statusContent
   * @param {number} data.options.sizeContent
   * @param {number} data.options.delayContent
   * @param {Array} data.notifications - project options
   */
  operate(data) {
    return new Promise((resolve, reject) => {
      if (!data.url) {
        reject(new Error('No url in data object'));
      }

      let client = (data.url.indexOf('https') === 0) ? https : http;
      let _msg = {
        _id: data._id,
        url: data.url,
        name: data.name,
        options: data.options,
        notifications: data.notifications
      };

      // Request project
      client.get(_msg.url)
        .on('response', (res) => {
          let body = '';
          let startTime = (new Date()).getTime();
          let endTime;
          let time;

          res.on('data', (bodyData) => {
            body += bodyData;
          });

          res.on('end', () => {
            // On request complete
            endTime = (new Date()).getTime();
            time = endTime - startTime;
            console.log(_msg.url, res.statusCode, time, body.length, '=======');

            _msg.newOptions = {
              statusContent: res.statusCode,
              sizeContent: body.length, // == Buffer.from(body).length
              delayContent: time
            };

            this.addTask('ResponseWorker', _msg);
            resolve();
          });
        })
        .on('error', (err) => {
          console.log('ERROR in http request. Check your internet connection', err);
          reject(new Error('PING failed for project ' + JSON.stringify(_msg)));
        });
    });
  }
}

module.exports = RequestWorker;