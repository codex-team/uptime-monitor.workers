/**
 * @file Describe class BaseWorker.
 * @author dyadyaJora
 */

const request = require('request-promise');
let config = require('../config');

/**
 *  Class repesentation a BaseWorker
 *  @class BaseWorker
 *  @abstract
 *  @property {string} name - worker name.
 *  @property {number} index - workers serial number.
 */
class BaseWorker {
  /**
   * Create a worker.
   * @param {string} name - worker name.
   * @param {number} index - workers serial number.
   */
  constructor(name, index) {
    this.name = name || null;
    this.index = index || null;
  }

  /**
   * Wrapper for starting each worker
   */
  start() {
    console.log('Worker ' + this.name + ' [' + this.index + ']' + ' started');
    this.popTask()
      .then((data) => {
        return this.operate(data);
      })
      .then(() => {
        this.start(); // recursion
      })
      .catch((err) => {
        this.start(); // try again
        console.log('smth went wrong', err);
      });
  }

  /**
   * Call api for adding task in queue
   * @param {number} worker - worker index
   * @param {object} options
   */
  addTask(worker, options) {
    console.log('REQUEST from worker' + worker + ', with options ' + JSON.stringify(options));
    request({
      method: 'POST',
      uri: config.registryUrl.addTask,
      body: JSON.stringify({
        worker: worker,
        options: options
      })
    });
  }

  /**
   * Call api for pop task from queue
   * @param {object} options
   */
  popTask(options) {
    return request({
      uri: config.registryUrl.getTask,
      qs: {
        worker: this.index
      }
    });
  }

  /**
   * Make some work.
   * @virtual
   * @param {object} data
   */
  operate(data) { }
}

module.exports = BaseWorker;
