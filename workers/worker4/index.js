/**
 * @file Run Worker 4 / Notify.
 */

let NotifyWorker = require('./worker4');
let worker = new NotifyWorker();

worker.start();