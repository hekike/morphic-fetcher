/*
 * Request
 *
 * @module Request
 */

var Readable = require('stream').Readable;

var util = require('util');
var url = require('url');

var debug = require('debug')('fetcher-res');


/*
 * Request
 *
 * @name Request
 * @constructor
 * @callback
 *
 */
function Request(options) {
  options = options || {};

  Readable.call(this);

  var parsedUrl;
  var formatter;
  var type;

  this.method = options.method || 'GET';
  this.url = options.url || '';
  this.headers = options.headers || {};
  this.body = options.body;

  parsedUrl = url.parse(this.url);

  this.pathname = parsedUrl.pathname;

  if(this.headers['content-type']) {
    type = this.headers['content-type'].split(/ *; */).shift();
    formatter = Request.format[type];
  }

  if(formatter && options.body) {
    this.push(formatter.call(formatter, options.body));
    this.push(null);
  }
}

Request.format = {
  'application/x-www-form-urlencoded': String,
  'application/json': JSON.stringify
};

util.inherits(Request, Readable);


module.exports = Request;
