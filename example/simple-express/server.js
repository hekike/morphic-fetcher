var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var isomorphicApp = require('../common/app');

var app = express();

app.use(bodyParser.json());                         // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static(path.join(__dirname, '../common/static')));

app.post('/users/:id', function (req, res) {
  res.json({
    method: 'post',
    user: req.params.id,
    query: req.query,
    body: req.body
  });
});

app.listen(3000, function () {
  console.log('server is listening on port 3000');
});


// Read user (runs on server side)
isomorphicApp.readUserFetcher(function () {
  var args = Array.prototype.slice.call(arguments);
  app.handle.apply(app, args);
});
