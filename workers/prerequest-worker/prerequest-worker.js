/**
 * @file describe class for PreRequestWorker.
 */

const request = require('request-promise');
let BaseWorker = require('../base-worker');
let config = require('../../config');

/** @constant {number} delay for first worker (each one minute)*/
const QUANT_TIME = config.quantTime;

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
   * Make some work every tick
   * Check lastPing time and current time. Generate queue for request
   * @override
   */
  start() {
    console.log('Worker [0] started');
    // Every minute get all projects and create request queue
    setInterval(() => {
      request({
        method: 'POST',
        url: config.apiUrl.getAll,
        body: { query: 'query GetAllProjects{projects {name, url}}' },
        json: true
      }).then((res) => {
        console.log('Success tick', res);
        if (!res || !res.data || !res.data.projects) {
          throw new Error('apiUrl getAll return XpeHb');
        }

        res = res.data.projects;
        res.forEach((item) => {
          if (this._needPingNow(item)) {
            let newMsg = {
              _id: item._id || '-1',
              url: item.url,
              name: item.name,
              options: item.options || {},
              notifications: item.notifications || []
              // @todo option ARGUMENTS !!!!!
            };

            this.addTask('RequestWorker', newMsg);
            // http.post('.../upStatus', {_id: item:_id, status: 'pending'});
            /** @todo (notCritical)
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
    }, QUANT_TIME);
  }

  /**
   * Check current time and last ping time of project
   * @param {object} item from api
   * @param {Date} item.lastPing
   * @param {number} item.delay
   * @returns {boolean}
   */
  _needPingNow(item) {
    // @todo remove stub
    item.lastPing = item.lastPing || new Date(0);
    item.delay = item.delay || 1;

    let current = (new Date()).getTime();
    let last = (new Date(item.lastPing)).getTime();

    return current > last + item.delay;
  }
}

module.exports = PreRequestWorker;