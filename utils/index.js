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
  }
};