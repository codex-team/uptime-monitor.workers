/**
 * @file Describe class BaseWorker.
 * @author dyadyaJora
 */

const Socket = require('net').Socket;
const crypto = require('crypto');
let config = require('../config');
let utils = require('../utils');

/**
 *  Class repesentation a BaseWorker
 *  @class BaseWorker
 *  @abstract
 *  @property {string} name - worker name.
 *  @property {string} hash - unique random hash to identify workers instances.
 */
class BaseWorker {
  /**
   * Create a worker.
   * @param {string} name - worker name.
   */
  constructor(name) {
    this.name = name || null;
    this.hash = this._generateHash();

    this.socket = new Socket();
  }

  /**
   * Wrapper for starting each worker
   */
  start() {
    console.log('Worker ' + this.name + ' started');

    this.socket.connect(config.socketPort, config.socketHost, () => {
      this.sendInit();
    });

    this.socket.on('data', (data) => {
      console.log('task given');
      data = utils.jsonFromBuffer(data);

      if (!data || !data.type) {
        return;
      }

      if (data.type == 'INIT') {
        console.log('connected successfuly');
      }

      if (data.type == 'POP_TASK') {
        this.operate(data)
          .then(() => {
            this.freeTask(this.name);
          })
          .catch((err) => {
            console.log(err, 'ERROR when operating task');
          });
      }
    });

    this.socket.on('error', () => {
      console.log('socket error');

      // try connect again or another catcher
    });
  }

  /**
   * Call socket api for adding task in queue
   * @param {string} worker - worker name
   * @param {object} options
   * @returns {boolean}
   */
  addTask(worker, options) {
    console.log('REQUEST from worker' + worker + ', with options ' + JSON.stringify(options));
    let buf = utils.jsonToBuffer({worker: worker, options: options});

    return this.socket.write(buf);
  }

  /**
   * Send socket alarm about completing task
   * @params {string} worker - worker name
   */
  freeTask(worker) {
    let buf = utils.jsonToBuffer({worker: worker, isFree: true});

    return this.socket.write(buf);
  }

  /**
   * Send init message
   * @params {string} worker - worker name
   */
  sendInit(worker) {
    let buf = utils.jsonToBuffer({type: 'INIT', message: { room: this.name, id: this.hash }});

    return this.socket.write(buf);
  }

  /**
   * Make some work every tick
   * Must be overrided in children
   * @virtual
   * @param {object} data
   */
  operate(data) { }

  /**
   * Generating random hash
   * @returns {string}
   */
  _generateHash() {
    return crypto.randomBytes(16).toString('hex');
  }
}

module.exports = BaseWorker;
