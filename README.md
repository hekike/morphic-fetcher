morphic-fetcher
===============

Isomorphic fetcher which works on both client and server side

* **client:** Makes AJAX request with [Superagent](https://github.com/visionmedia/superagent)
* **server:** Simulates [http.ClientRequest](http://nodejs.org/api/http.html#http_class_http_clientrequest) and [http.ServerResponse](http://nodejs.org/api/http.html#http_class_http_serverresponse) class, to trigger the original router and return with the data
 
# Usage

See examples below.

## res

Like in superagent.

```javascript
res.ok
res.text
res.body
res.status
...
```

http://visionmedia.github.io/superagent/#response-properties


# Examples

## Common / client

Check the **example/simple-koa/** directory and run with `npm start` after the `npm install`.

```javascript
var Fetcher = require('morphic-fetcher');

var readUser = new Fetcher({
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
More frameworks are coming soon.

### Koa
```javascript
var readUser = new Fetcher({ ... }, function (res) { 
  console.log(res.status, res.body); 
};

// Trigger http "request"
app.callback()(readUser.req, readUser.res);
```

### Express

**// TODO** 

I'm not sure yet, how to do this.  
Because express exposes node's `req` and `res` objects, instead of it's own.

It should start with:
```javascript
var readUser = new Fetcher({ ... }, function (res) { 
  console.log(res.status, res.body); 
};

// Trigger http "request"
app.handle(readUser.req, readUser.res, function (err) { ... };
```

More about this:
https://github.com/koajs/koa/blob/master/docs/koa-vs-express.md


