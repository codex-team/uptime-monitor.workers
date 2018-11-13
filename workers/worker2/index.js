/**
 * @file Worker 2 - make request.
 * @author dyadyaJora
 */

const amqp = require('amqplib');
const http = require('http');
let config = require('../../config');

console.log('Worker2 STARTED');

amqp.connect(config.rabbitUrl)
  .then(connection => {
    return connection.createChannel();
  })
  .then(channel => {
    channel.assertQueue('request');
    channel.prefetch(1);
    channel.consume('request', (msg) => {
      console.log(msg.content.toString());
      let item = JSON.parse(msg.content);

      // Request project
      http.get(item.url)
        .on('response', (res) => {
          let body = '';
          let time = 0;
          let timerId = setInterval(() => {
            time++;
          }, 1);

          console.log(res, '__');

          res.on('data', (data) => {
            body += data;
          });

          res.on('end', () => {
            // On request complete
            clearInterval(timerId);
            channel.ack(msg);
            console.log(body, '=======', time);

            // channel.assertQueue('request');
            // channel.sendToQueue('request', Buffer.alloc(_msg.length, _msg));
          });
        })
        .on('error', (err) => {
          console.log('ERROR in http request. Check your internet connection', err);
        });
    });
  })
  .catch(err => {
    console.log(err, 'Error in worker2');
  });

/**
 * Check current time and last ping time of project
 * @param {object} item from api
 * @returns {boolean}
 */
function needPingNow(item) {
  let current = (new Date()).getTime();
  let last = (new Date(item.lastPing)).getTime();

  return current > last + item.delay;
}