/**
 * @file Describe class BaseWorker.
 * @author dyadyaJora
 */

const request = require('request-promise');
const crypto = require('crypto');
let config = require('../config');

/**
 *  START STUB for api-server, registry-server, notify-endpoint in dev mode
 */

if (process.env.NODE_ENV == 'development') {
  const nock = require('nock');
  let stubData = require('../data/api/getAll.json');
  let stubTask = require('../data/registry/getTask.json');
  let utils = require('../utils');

  nock(config.apiUrl.index)
    .log(console.log)
    .persist()
    // @todo postResult to api(notify)
    .post('/', { query: utils.getSchema('queries/GetAllProjects.graphql') })
    .delayBody(1000)
    .reply(200, stubData);

  nock(config.registryUrl.index)
    .log(console.log)
    .persist()
    .get('/api/popTask/RequestWorker')
    .delayBody(1000)
    .reply(200, { task: stubTask })
    .get('/api/popTask/ResponseWorker')
    .delayBody(1000)
    .reply(200, { task: stubTask })
    .get('/api/popTask/NotifyWorker')
    .delayBody(1000)
    .reply(200, { task: stubTask })
    .filteringRequestBody(function (body) {
      return '*';
    })
    .put(/api\/pushTask\/.*/, '*')
    .delayBody(1000)
    .reply(200, 'put success');

  nock('http://exapmle.com')
    .persist()
    .get('/ok')
    .reply(200, 'Succes Result')
    .get('/bad')
    .reply(502);

  nock(config.testhookUrl)
    .log(console.log)
    .persist()
    .filteringRequestBody(function (body) {
      return '*';
    })
    .post('', '*')
    .delayBody(1000)
    .reply(200);
}

/**
 *  END STUB
 */

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
  }

  /**
   * Wrapper for starting each worker
   */
  start() {
    console.log('Worker ' + this.name + ' started');
    this.popTask()
      .then((data) => {
        console.log('task given');
        if (data.statusCode == 200 && data.body['task']) {
          return this.operate(data.body.task);
        }

        return new Promise((resolve, reject) => {
          if (data.statusCode >= 500) {
            reject(new Error('Error with registry'));
          } else {
            resolve();
          }
        });
      })
      .then(() => {
        this.start(); // recursion
      })
      .catch((err) => {
        this.start(); // try again
        console.log('smth went wrong', err, 'BASE ERRORHANDLER');
      });
  }

  /**
   * Call api for adding task in queue
   * @param {string} worker - worker name
   * @param {object} options
   */
  addTask(worker, options) {
    console.log('REQUEST from worker' + worker + ', with options ' + JSON.stringify(options));
    request({
      method: 'PUT',
      uri: config.registryUrl.addTask + worker,
      body: options,
      json: true,
      resolveWithFullResponse: true
    });
  }

  /**
   * Call api for pop task from queue
   * @param {object} options
   */
  popTask(options) {
    return request({
      uri: config.registryUrl.getTask + this.name,
      resolveWithFullResponse: true,
      json: true
    });
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
