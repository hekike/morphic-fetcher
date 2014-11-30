var path = require('path');

module.exports = {
  context: path.join(__dirname, '../../'),
  entry: './example/common/app',
  output: {
    path: path.join(__dirname, '/static'),
    filename: "bundle.js"
  }
};
