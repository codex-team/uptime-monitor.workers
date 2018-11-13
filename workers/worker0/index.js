/**
 * @file Run Worker 0 / Init worker.
 * @author dyadyaJora
 */

let InitWorker = require('./worker0');
let worker = new InitWorker();

worker.start();