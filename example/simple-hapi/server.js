var path = require('path');

var Hapi = require('hapi');
var server = new Hapi.Server(3000);

var isomorphicApp = require('../common/app');
var STATIC = '../common/static/';

server.route({
  method: 'POST',
  path: '/users/{id}',
  handler: function (request, reply) {
    reply({
      param: request.params,
      query: request.query,
      body: request.payload
    });
  }
});

server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: STATIC
    }
  }
});

server.start(function () {
  
  // Read user (runs on server side)
  isomorphicApp.readUserFetcher(server, function (res) {
    console.log(res);
  });
});
