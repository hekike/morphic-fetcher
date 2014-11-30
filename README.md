morphic-fetcher
===============

Isomorphic fetcher which works on both client and server side  

[![Build Status](https://travis-ci.org/hekike/morphic-fetcher.svg?branch=master)](https://travis-ci.org/hekike/morphic-fetcher)


# Examples

## Common / client

Check the **example/simple-hapi/** directory and run with `npm start` after the `npm install`.

```
var Fetcher = require('morphic-fetcher');

var readUser = new Fetcher(server, {
  method: 'POST',
  host: 'http://localhost:3000',
  url: '/users/:user',
  param: {
    user: 'john'
  },
  query: {
    limit: 100
  },
  headers: {
    'content-type': 'application/json; charset=utf-8'
  },
  body: {
    foo: 'bar',
    bar: [1,2,3]
  }
}, function(res) {}
  console.log(res.status, res.body);
});
```

## Server side
More framework is coming soon.

### Hapi
```
var Hapi = require('hapi');
var server = new Hapi.Server();

var readUser = new Fetcher(server, { .. }, function (res) {
  ..
});
```
