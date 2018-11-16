module.exports = {
  httpType: 'http',
  baseHost: 'localhost',
  webPort: 3002,
  mongodbUri: 'mongodb://localhost/uptime-monitor',
  rabbitPort: 5672,
  rabbitUrl: 'amqp://localhost',
  apiUrl: {
    getAll: '' || 'http://localhost:8080/api/getAll.json',
    postResult: '' || 'http://localhost:8080/api/postResult.json'
  },
  registryUrl: {
    getTask: '' || 'http://localhost:8080/registry/getTask.json',
    addTask: '' || 'http://localhost:8080/registry/postTask.json'
  }
};