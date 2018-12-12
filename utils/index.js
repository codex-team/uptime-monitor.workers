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
   * @returns {object|null}
   */
  jsonFromBuffer: function (buff) {
    let result;

    try {
      result = JSON.parse(buff.toString());
    } catch (err) {
      result = null;
    }

    return result;
  },

  /**
   * Convert JSON to buffer data
   * (for sockets)
   * @param {object} JSON message
   * @returns {Buffer|null}
   */
  jsonToBuffer: function (obj) {
    let result;

    try {
      result = Buffer.from(JSON.stringify(obj) + ',');
    } catch (err) {
      result = null;
    }

    return result;
  }

};