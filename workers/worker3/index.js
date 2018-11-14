/**
 * @file Run Worker 3 / Parse response, create notify queue.
 */

let ResponseWorker = require('./worker3');
let worker = new ResponseWorker();

worker.start();