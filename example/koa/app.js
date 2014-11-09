var koa = require('koa');
var parse = require('co-body');
var router = require('koa-router');

var Fetcher = require('../../');

var app = module.exports = koa();
require('koa-qs')(app);
app.use(router(app));

app.get('/users/:id', function *(next) {
  yield next;
  this.body = {
    user: this.params.id,
    query: this.query
  };
});

app.post('/users/:id', function *(next) {
  var body = yield parse(this, {limit: '1kb'});
  yield next;
  this.body = {
    user: this.params.id,
    body: body,
    query: this.query
  };
});



if (!module.parent) {
  app.listen(3000);
}

var fetcher = new Fetcher({
  method: 'POST',
  host: '/',
  url: 'users/john?limit=100',
  headers: {
    //'content-type': 'application/x-www-form-urlencoded',
    'content-type': 'application/json; charset=utf-8'
  },
  //body: 'password=fivestars'
  body: {
    foo: 'bar',
    bar: [1,2,3]
  }
}, function(res) {
  console.log(res.status, res.body);
});

// Trigger "request"
app.callback()(fetcher.req, fetcher.res);
