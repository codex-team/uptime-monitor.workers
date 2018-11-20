/**
 * Configurations
 * @property {number} quantTime - default delay for ping loop 1 minute
 * @property {string} baseHost - base workers host IP or localhost
 * @property {string} testhookUrl -  url for sending notify mesage
 * @property {object} apiUrl -  urls for requests to API server
 * @property {string} apiUrl.getAll - get all projects url
 * @property {string} apiUrl.postResult - post ping result
 * @property {object} registryUrl -  urls for request to registry
 * @property {object} registryUrl.getTask - url for popTask from registry
 * @property {object} registryUrl.addTask  - url for pushTask to registry
 */
module.exports = {
  quantTime: 60000,
  baseHost: 'localhost',
  testhookUrl: 'https://notify.bot.ifmo.su/u/CTKV8JSA',
  apiUrl: {
    getAll: '' || 'http://localhost:8080/api/getAll.json',
    postResult: '' || 'http://localhost:8080/api/postResult.json'
  },
  registryUrl: {
    getTask: 'https://registry.ifmo.su/api/popTask/' || 'http://localhost:8080/registry/getTask.json',
    addTask: 'https://registry.ifmo.su/api/pushTask/' || 'http://localhost:8080/registry/postTask.json'
  }
};