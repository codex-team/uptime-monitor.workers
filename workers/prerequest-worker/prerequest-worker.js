/**
 * @file describe class for PreRequestWorker.
 */

const request = require('request-promise');
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
   * Create a worker.
   */
  constructor() {
    super('PreRequestWorker');
  }

  /**
   * @override
   * @param {object} data
   */
  operate(data) {
    return request.get(config.apiUrl.getAll)
      .then((res) => {
        if (!res) {
          throw new Error('apiUrl getAll return XpeHb');
        }

        res = JSON.parse(res);
        res.forEach((item) => {
          if (this._needPingNow(item)) {
            let newMsg = {
              _id: item._id,
              url: item.url
              // TODO option ARGUMENTS !!!!!
            };

            this.addTask('RequestWorker', newMsg);
            // http.post('.../upStatus', {_id: item:_id, status: 'pending'});
            /** TODO (notCritical)
             *  в прошлой версии при начале обработки сущности project
             *  в цепочке воркеров - я выставлял в базу данному документу поле status: 'pending'
             *  это гарантировало тот факт, что project повторно не будет попадать в очередь
             *  пока наш квант времени 1 минута - этой проблемы возникать не будет, но как только
             *  задача будет висеть в очередях дольше этого времени - CRASHED
             *  как с этим быть сейчас? на чьей стороне это надо предусматривать?
             */
          }
        });

        return new Promise((resolve, reject) => {
          resolve();
        });
      });
  }

  /**
   * Check current time and last ping time of project
   * @param {object} item from api
   * @param {Date} item.lastPing
   * @param {number} item.delay
   * @returns {boolean}
   */
  _needPingNow(item) {
    let current = (new Date()).getTime();
    let last = (new Date(item.lastPing)).getTime();

    return current > last + item.delay;
  }
}

module.exports = PreRequestWorker;