/**
 * @file describe class for Worker 2.
 */

const http = require('http');
let BaseWorker = require('../base-worker');

/**
 * Class repesentation a RequestWorker
 * Second worker, make request
 * @class RequestWorker
 * @extends BaseWorker
 */
class RequestWorker extends BaseWorker {
  /**
   * Create a worker 2.
   */
  constructor() {
    super('RequestWorker', 2, 'request', 'response');
  }

  /**
   * Run after worker started.
   * @override
   * @param {object} channel - rabbit channel
   */
  onStarted(channel) {
    channel.assertQueue('request');
    channel.prefetch(1);
    channel.consume('request', (msg) => {
      console.log(msg.content.toString());
      let item = JSON.parse(msg.content);
      let _msg = item || { };

      // Request project
      http.get(item.url)
        .on('response', (res) => {
          let body = '';
          let time = 0;
          let timerId = setInterval(() => {
            time++;
          }, 1);

          res.on('data', (data) => {
            body += data;
          });

          res.on('end', () => {
            // On request complete
            clearInterval(timerId);
            channel.ack(msg);
            console.log(item.url, res.statusCode, time, body.length, '=======');

            _msg.newOptions = {
              statusContent: 200,
              sizeContent: body.length, // == Buffer.from(body).length
              delayContent: time
            };
            _msg = JSON.stringify(_msg);
            channel.assertQueue('response');
            channel.sendToQueue('response', Buffer.from(_msg));
          });
        })
        .on('error', (err) => {
          console.log('ERROR in http request. Check your internet connection', err);
        });
    });
  }
}

module.exports = RequestWorker;