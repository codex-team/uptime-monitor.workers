/**
 * @file Run Init Worker.
 */

let InitWorker = require('./init-worker');
let worker = new InitWorker();

worker.start();