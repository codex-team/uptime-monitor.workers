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
   * @param {object} data.options - project options
   * @param {number} data.options.statusContent
   * @param {number} data.options.sizeContent
   * @param {number} data.options.delayContent
   */
  operate(data) {
    data = JSON.parse(data);
    let client = (data.url.indexOf('https') === 0) ? https : http;
    let _msg = {
      _id: data._id,
      url: data.url,
      options: data.options
    };

    return new Promise((resolve, reject) => {
      // Request project
      client.get(_msg.url)
        .on('response', (res) => {
          let body = '';
          let time = 0;
          let timerId = setInterval(() => {
            time++;
          }, 1);

          res.on('data', (bodyData) => {
            body += bodyData;
          });

          res.on('end', () => {
            // On request complete
            clearInterval(timerId);
            console.log(_msg.url, res.statusCode, time, body.length, '=======');

            _msg.newOptions = {
              statusContent: 200,
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