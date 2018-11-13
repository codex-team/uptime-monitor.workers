/**
 * @file Worker 1 - create queue of projects for ping.
 * @author dyadyaJora
 */

const amqp = require('amqplib');
let config = require('../../config');

console.log('Worker1 STARTED');

amqp.connect(config.rabbitUrl)
  .then(connection => {
    return connection.createChannel();
  })
  .then(channel => {
    channel.assertQueue('init');
    // TODO: in future for scaling
    // channel.prefetch(1);
    channel.consume('init', (msg) => {
      channel.ack(msg);
      // ====================
      // * DO foreach projects - check delay - create new queue
      // ====================
      // * channel.assertQueue('request');
      // * channel.sendToQueue('request', msg);
      // ====================
    });
  })
  .catch(err => {
    console.log(err, 'Error in worker1');
  });