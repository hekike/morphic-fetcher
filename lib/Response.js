/*
 * Response
 *
 * @module Response
 */


var util = require('util');
var Writable = require('stream').Writable;

var debug = require('debug')('fetcher-res');



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
 * Response
 *
 * @name Response
 * @constructor
 * @callback
 *
 */
function Response(callback) {
  Writable.call(this);

  this.headersSent = false;
  this.socket = {
    writable: true
  };

  this.headers = {};

  this.callback = callback;
}

Response.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

util.inherits(Response, Writable);

// TODO: support stream
Response.prototype.writeContinue = function () {
  debug('writeContinue');
};

Response.prototype.writeHead = function (statusCode, reasonPhrase, headers) {
  debug('writeHead', statusCode, reasonPhrase, headers);
};

Response.prototype.setTimeout = function (msecs, cb) {
  debug('setTimeout', msecs);

  setTimeout(cb, msecs);
};

Response.prototype.setHeader = function (name, value) {
  debug('setHeader', name, value);

  this.headers[name] = value;
};

Response.prototype.sendDate = function () {
  debug('sendDate');
};

Response.prototype.getHeader = function (name) {
  debug('getHeader', name);

  return this.headers[name];
};

Response.prototype.removeHeader = function (name) {
  debug('removeHeader', name);

  delete this.headers[name];
};

// TODO: support stream
Response.prototype.write = function (chunk, encoding) {
  debug('write', encoding);
};

Response.prototype.addTrailers = function (headers) {
  debug('addTrailers', headers);
};

Response.prototype.parseBody = function(str, type){
  var parse = Response.parse[type];

  return parse && str && str.length
    ? parse(str)
    : null;
};

Response.prototype.end = function (data, encoding) {
  debug('end', data, encoding);

  var resType = null;
  var resCharset = null;
  var resTemp;

  if(this.headers['Content-Type']) {
    resTemp = this.headers['Content-Type'].split(/ *; */);
    resType = resTemp.shift();
    resCharset = resTemp.shift();
  }

  var type = this.statusCode / 100 | 0;
  var res = {
    body: this.parseBody(String(data), resType),
    headers: this.headers,
    text: data,
    type: resType,
    charset: resCharset
  };

  // status / class
  res.status = this.statusCode;
  res.statusType = type;

  // basics
  res.info = 1 == type;
  res.ok = 2 == type;
  res.clientError = 4 == type;
  res.serverError = 5 == type;
  res.error = 4 == type || 5 == type;

  // sugar
  res.accepted = 202 == this.statusCode;
  res.noContent = 204 == this.statusCode || 1223 == this.statusCode;
  res.badRequest = 400 == this.statusCode;
  res.unauthorized = 401 == this.statusCode;
  res.notAcceptable = 406 == this.statusCode;
  res.notFound = 404 == this.statusCode;
  res.forbidden = 403 == this.statusCode;

  if(typeof this.callback === 'function') {
    this.callback(res, encoding);
  }
};

module.exports = Response;
