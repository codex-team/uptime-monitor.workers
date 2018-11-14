/**
 * @file describe class for Worker 1.
 * @author dyadyaJora
 */

const http = require('http');
let BaseWorker = require('../base-worker');
let config = require('../../config');

/**
 * Class repesentation a PreRequestWorker
 * First Worker, check lastPingTime and create queue for request
 * @class PreRequestWorker
 * @extends BaseWorker
 */
class PreRequestWorker extends BaseWorker {
  /**
   * Create a worker 1.
   */
  constructor() {
    super('PreRequestWorker', 1, 'init', 'request');
  }

  /**
   * Run after worker started.
   * @override
   * @param {object} channel - rabbit channel
   */
  onStarted(channel) {
    this.assertPrevQueue(channel);
    // TODO: in future for scaling
    // channel.prefetch(1);
    this.subscribePrev(channel, (msg) => {
      this._onMessageRecieve(channel, msg);
    });
  }

  /**
   * Callback on recieve message from prev queue.
   * @param {object} channel - rabbit channel
   * @param {object} msg - recieved message
   */
  _onMessageRecieve(channel, msg) {
    console.log('recieving msg callback, msg ===', msg);

    let projects = '';

    // Request to api - get all projects
    http.get(config.apiUrl)
      .on('response', (res) => {
        res.on('data', (data) => {
          projects += data;
        });

        res.on('end', () => {
          // On request complete
          // channel.ack(msg);
          projects = JSON.parse(projects);

          this.assertNextQueue(channel);

          projects.forEach((item) => {
            if (this._needPingNow(item)) {
              let newMsg = {
                _id: item._id,
                url: item.url
              };
              let _msg = JSON.stringify(newMsg);

              this.sendToNextQueue(channel, Buffer.from(_msg));
              console.log(_msg, '_+__+_');
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
  }

  /**
   * Check current time and last ping time of project
   * @param {object} item from api
   * @returns {boolean}
   */
  _needPingNow(item) {
    let current = (new Date()).getTime();
    let last = (new Date(item.lastPing)).getTime();

    return current > last + item.delay;
  }
}

module.exports = PreRequestWorker;