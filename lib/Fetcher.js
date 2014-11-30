var risingUrl = require('rising-url');


/**
* Parse the given x-www-form-urlencoded `str`.
*
* @param {String} str
* @return {Object}
* @api private
*/
function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var parts;
  var pair;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    parts = pair.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }

  return obj;
}


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
    var resCb = function (res) {
      var type = res.statusCode / 100 | 0;
      var resType = null;
      var resCharset = null;
      var resTemp;
      var bodyParser;
      var body;

      if(res.headers['content-type']) {
        resTemp = res.headers['content-type'].split(/ *; */);
        resType = resTemp.shift();
        resCharset = resTemp.shift();
      }

      bodyParser = Fetcher.parser[resType];
      body = bodyParser && res.payload && res.payload.length ? bodyParser(res.payload) : null;

      // Superagent equal response
      callback({
        status: res.statusCode,
        body: body,
        headers: res.headers,
        text: res.rawPayload.toString(),

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
    };

    var reqOptions = {
      method: options.method,
      url: options.url,
      headers: options.headers,
      payload: options.body
    };

    // Hapi support
    if(app.inject) {
      app.inject(reqOptions, resCb);
    } else {
      require('shot').inject(app, reqOptions, resCb);
    }
  }
}

Fetcher.parser = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

module.exports = Fetcher;
