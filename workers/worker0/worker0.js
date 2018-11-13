/**
 * @file describe class for Worker 0.
 * @author dyadyaJora
 */

let BaseWorker = require('../base-worker');
const QUANT_TIME = 5000;

class Worker0 extends BaseWorker {
  constructor() {
    super();
    this.name = 'Worker0';
    this.queue = 'init';
  }

  // @override
  onStarted(channel, flag) {
    // Every minute send to queue INIT any message that would started WORKER1 again and again
    setInterval(() => {
      channel.assertQueue('init')
        .then(() => {
          return channel.sendToQueue('init', Buffer.alloc(1));
        })
        .catch((err) => {
          console.log('something went wrong', err);
          // TODO Error handler
        });
    }, QUANT_TIME);
  }
}

module.exports = Worker0;