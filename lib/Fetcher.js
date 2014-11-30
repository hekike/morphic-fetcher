var risingUrl = require('rising-url');


/*
 * Fetcher
 *
 * @name Fetcher
 * @constructor
 * @param {Object} options
 * @callback
 */
function Fetcher(app, options, callback) {
  var isClient = !!global.document;
  var name;
  var agentReq;
  var shot;
  var request;

  options = options || {};

  options.url = '/' + risingUrl.format(options.url || '/', {
    param: options.param,
    query: options.query,
    hash: options.hash
  });

  // Client side
  if (isClient) {
    request = require('superagent');
    agentReq = request[options.method](options.host + options.url)
      .send(options.body);

    for (name in options.headers) {
      agentReq.set(options.headers[name]);
    }

    agentReq.end(function (res) {
      if(typeof callback === 'function') {
        callback(res);
      }
    });
  }

  // Server side
  else {
    shot = require('shot');
    shot.inject(app, {
      method: options.method,
      url: options.url,
      headers: options.headers,
      payload: options.body      
    }, function (res) {
      var type = res.statusCode / 100 | 0;
      var resType = null;
      var resCharset = null;
      var resTemp;

      if(res.headers['Content-Type']) {
        resTemp = res.headers['Content-Type'].split(/ *; */);
        resType = resTemp.shift();
        resCharset = resTemp.shift();
      }

      // Superagent equal response
      callback({
        status: res.statusCode,
        body: res.payload,
        headers: res.headers,
        text: res.rawPayload,

        statusType: type,

        info: 1 == type,
        ok: 2 == type,
        clientError: 4 == type,
        serverError: 5 == type,
        error: 4 == type || 5 == type,

        accepted: 202 == res.statusCode,
        noContent: 204 == res.statusCode || 1223 == res.statusCode,
        badRequest: 400 == res.statusCode,
        unauthorized: 401 == res.statusCode,
        notAcceptable: 406 == res.statusCode,
        notFound: 404 == res.statusCode,
        forbidden: 403 == res.statusCode
      });
    });
  }
}

module.exports = Fetcher;
