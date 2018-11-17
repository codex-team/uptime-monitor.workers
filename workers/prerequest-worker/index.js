/**
 * @file Run Prerequest Worker / Prepare queue for request.
 */

let PreRequestWorker = require('./prerequest-worker');
let worker = new PreRequestWorker();

worker.start();