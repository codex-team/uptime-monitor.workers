/**
 * @file Run Worker 0.
 * @author dyadyaJora
 */

let InitWorker = require('./worker0');
let worker = new InitWorker();

worker.start();