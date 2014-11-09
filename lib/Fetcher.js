var Request = require('./Request');
var Response = require('./Response');

var agent = require('superagent');


/*
 * Fetcher
 *
 * @name Fetcher
 * @constructor
 * @param {Object} options
 * @callback
 */
function Fetcher(options, callback) {
  options = options || {};

  var req = new Request(options);
  var res = new Response(callback);
  var name;
  var agentReq;

  // Client side
  if (global.document) {
    agentReq = agent[req.method](req.url)
      .send(req.body);

    for (name in req.headers) {
      if (req.headers.hasOwnProperty(name)) {
        agentReq.set(req.headers[name]);
      }
    }

    agentReq.end(function (res) {
      if(typeof callback === 'function') {
        callback(res);
      }
    });
  }

  return {
    req: req,
    res: res
  }
}

module.exports = Fetcher;
