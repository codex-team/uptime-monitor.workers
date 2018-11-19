/**
 * @file Run Notify Worker.
 */

let NotifyWorker = require('./notify-worker');
let worker = new NotifyWorker();

worker.start();