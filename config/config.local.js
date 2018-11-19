module.exports = {
  httpType: 'http',
  baseHost: 'localhost',
  webPort: 3002,
  mongodbUri: 'mongodb://localhost/uptime-monitor',
  rabbitPort: 5672,
  rabbitUrl: 'amqp://localhost',
  testhookUrl: 'https://notify.bot.ifmo.su/u/97MQ4RE1',
  apiUrl: {
    getAll: '' || 'http://localhost:8080/api/getAll.json',
    postResult: '' || 'http://localhost:8080/api/postResult.json'
  },
  registryUrl: {
    getTask: 'https://registry.ifmo.su/api/popTask/' || 'http://localhost:8080/registry/getTask.json',
    addTask: 'https://registry.ifmo.su/api/pushTask/' || 'http://localhost:8080/registry/postTask.json'
  }
};