/**
 * @file Run Response Worker / Parse response, create notify queue.
 */

let ResponseWorker = require('./response-worker');
let worker = new ResponseWorker();

worker.start();