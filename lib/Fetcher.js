var Request = require('./Request');
var Response = require('./Response');

var agent = require('superagent');
var risingUrl = require('rising-url');


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

  options.url = '/' + risingUrl.format(options.url || '/', {
    param: options.param,
    query: options.query,
    hash: options.hash
  });

  var isClient = !!global.document;
  var req = new Request(options);
  var res = new Response(callback);
  var name;
  var agentReq;

  // Client side
  if (isClient) {
    agentReq = agent[req.method.toLowerCase()](options.host + req.url)
      .send(req.body);

    for (name in req.headers) {
      agentReq.set(req.headers[name]);
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
