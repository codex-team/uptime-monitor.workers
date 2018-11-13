/**
 * @file Worker 0 - every minute(or quant time) sends a message to run Worker1.
 * @author dyadyaJora
 */

const amqp = require('amqplib');

let config = require('./config');
const QUANT_TIME = 5000;

console.log('Worker0 STARTED');

amqp.connect(config.rabbitUrl)
  .then((connection) => {
    return connection.createChannel();
  })
  .then((channel) => {
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
  })
  .catch((err) => {
    console.log('Connection to RABBITMQ failed, do smth', err);
  });