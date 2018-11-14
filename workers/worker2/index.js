/**
 * @file Run Worker 2 / Make request.
 */

let RequestWorker = require('./worker2');
let worker = new RequestWorker();

worker.start();