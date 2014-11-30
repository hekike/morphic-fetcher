var test = require('tape');
var nock = require('nock');

var fetcher = require('./fetcher');

test('client side', function (t) {
  nock('https://api.twitter.com:443')
  .post('/1.1/search/tweets.json?q=node', {'foo':'bar','bar':[1,2,3]})
  .once()
  .reply(200, { foo: 'bar' });

  t.plan(17);

  global.document = true;

  fetcher({}, function (res) {
      t.equal(res.status, 200);
      t.deepEqual(res.headers, { 'content-type': 'application/json' }, 'header should be set');
      t.equal(res.text, '{"foo":"bar"}', 'text should be equal');
      t.deepEqual(res.body, { foo: 'bar' }, 'body should be equal');

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

      delete global.document;
  });
});
