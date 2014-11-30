var test = require('tape');
var fetcher = require('./fetcher');

var Hapi = require('hapi');
var server = new Hapi.Server();

server.route({
  method: 'POST',
  path: '/{version}/search/tweets.json',
  handler: function (request, reply) {
    reply({
      param: request.params,
      query: request.query,
      body: request.payload
    });
  }
});


test('server side', function (t) {
  t.plan(17);

  fetcher(server, function (res) {
    t.equal(res.status, 200, 'status should be 200');
    t.equal(res.headers['content-type'], 'application/json; charset=utf-8', 'header should be set');
    t.equal(res.text, '{"param":{"version":"1.1"},"query":{"q":"node"},"body":{"foo":"bar","bar":[1,2,3]}}', 'text should be equal');
    t.deepEqual(res.body, { body: { bar: [ 1, 2, 3 ], foo: 'bar' }, param: { version: '1.1' }, query: { q: 'node' } }, 'body should be equal');

    t.equal(res.statusType, 2, 'statusType should be equal');
    t.equal(res.info, false, 'info should be false');
    t.equal(res.ok, true, 'ok should be false');
    t.equal(res.clientError, false, 'clientError should be false');
    t.equal(res.serverError, false, 'serverError should be false');
    t.equal(res.error, false, 'error should be false');

    t.equal(res.accepted, false, 'accepted should be false');
    t.equal(res.noContent, false, 'noContent should be false');
    t.equal(res.badRequest, false, 'badRequest should be false');
    t.equal(res.unauthorized, false, 'unauthorized should be false');
    t.equal(res.notAcceptable, false, 'notAcceptable should be false');
    t.equal(res.notFound, false, 'notFound should be false');
    t.equal(res.forbidden, false, 'forbidden should be false');
  });
});
