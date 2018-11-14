module.exports = {
  httpType: 'http',
  baseHost: 'localhost',
  webPort: 3002,
  mongodbUri: 'mongodb://localhost/uptime-monitor',
  rabbitPort: 5672,
  rabbitUrl: 'amqp://localhost',
  apiUrl: {
    getAll: '',
    postResult: ''
  },
  registryUrl: {
    getTask: '',
    addTask: ''
  }
};