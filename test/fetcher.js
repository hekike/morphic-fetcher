var Fetcher = require('../');

function readUserFetcher (server, cb) {
  var read = new Fetcher(server, {
    method: 'post',
    host: 'https://api.twitter.com:443',
    url: '/:version/search/tweets.json',
    param: {
      version: '1.1'
    },
    query: {
      q: 'node',
    },
    headers: {
      'content-type': 'application/json; charset=utf-8'
    },
    body: {
      foo: 'bar',
      bar: [1, 2, 3]
    }
  }, cb);
}

module.exports = readUserFetcher;
