/**
 * @file Run Worker 1 / Prepare queue for request.
 * @author dyadyaJora
 */

let PreRequestWorker = require('./worker1');
let worker = new PreRequestWorker();

worker.start();