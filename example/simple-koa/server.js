var path = require('path');

var koa = require('koa');
var parse = require('co-body');
var router = require('koa-router');
var serve = require('koa-static');

var isomorphicApp = require('./app');

var app = module.exports = koa();
require('koa-qs')(app);
app.use(router(app));

app.use(serve(path.join(__dirname, 'static')));

app.get('/users/:id', function *(next) {
  yield next;
  this.body = {
    user: this.params.id,
    query: this.query
  };
});

app.post('/users/:id', function *(next) {
  var body = yield parse(this, {
    limit: '1kb'
  });

  yield next;
  this.body = {
    user: this.params.id,
    body: body,
    query: this.query
  };
});

if (!module.parent) {
  app.listen(3000, function () {
    console.log('server is listening on port 3000');
  });
}


// Trigger "request"
var readUser = isomorphicApp.readUser;
app.callback()(readUser.req, readUser.res);
