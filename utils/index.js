const fs = require('fs');
const path = require('path');

module.exports = {
  /**
   * Getting graphql schema
   * @param {string} schemaLocation - path to schema over 'graphql-api' folder
   * @returns {string} string with graphql schema
   */
  getSchema: function (schemaLocation) {
    return fs.readFileSync(path.join(__dirname, '../graphql-api/' + schemaLocation)).toString();
  },

  /**
   * Convert buffer data to JSON
   * (for sockets)
   * @param {Buffer} message in buffer view
   * @returns {object}
   */
  jsonFromBuffer: function (buff) {
    return JSON.parse(buff.toString());
  },

  /**
   * Convert JSON to buffer data
   * (for sockets)
   * @param {object} JSON message
   * @returns {Buffer}
   */
  jsonToBuffer: function (obj) {
    return Buffer.from(JSON.stringify(obj));
  }

};