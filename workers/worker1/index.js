/**
 * @file Worker 1 - create queue of projects for ping.
 * @author dyadyaJora
 */

const amqp = require('amqplib');
const http = require('http');
let config = require('../../config');

console.log('Worker1 STARTED');

amqp.connect(config.rabbitUrl)
  .then(connection => {
    return connection.createChannel();
  })
  .then(channel => {
    channel.assertQueue('init');
    // TODO: in future for scaling
    // channel.prefetch(1);
    channel.consume('init', (msg) => {
      let projects = '';

      // Request to api - get all projects
      http.get(config.apiUrl)
        .on('response', (res) => {
          res.on('data', (data) => {
            projects += data;
          });

          res.on('end', () => {
            // On request complete
            channel.ack(msg);
            projects = JSON.parse(projects);

            channel.assertQueue('request');

            projects.forEach((item) => {
              if (needPingNow(item)) {
                let newMsg = {
                  _id: item._id,
                  url: item.url
                };
                let _msg = JSON.stringify(newMsg);

                channel.sendToQueue('request', Buffer.alloc(_msg.length, _msg));
                // http.post('.../upStatus', {_id: item:_id, status: 'pending'});
                /** TODO
                 *  в прошлой версии при начале обработки сущности project
                 *  в цепочке воркеров - я выставлял в базу данному документу поле status: 'pending'
                 *  это гарантировало тот факт, что project повторно не будет попадать в очередь
                 *  пока наш квант времени 1 минута - этой проблемы возникать не будет, но как только
                 *  задача будет висеть в очередях дольше этого времени - CRASHED
                 *  как с этим быть сейчас? на чьей стороне это надо предусматривать?
                 */
              }
            });
          });
        })
        .on('error', (err) => {
          console.log('ERROR in http request. Check your internet connection', err);
        });
    });
  })
  .catch(err => {
    console.log(err, 'Error in worker1');
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