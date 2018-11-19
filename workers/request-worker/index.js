/**
 * @file Run Request Worker / Make request.
 */

let RequestWorker = require('./request-worker');
let worker = new RequestWorker();

worker.start();