var Fetcher = require('../../index');

var readUser = new Fetcher({
  method: 'POST',
  host: 'http://localhost:3000',
  url: '/users/:user',
  param: {
    user: 'john'
  },
  query: {
    limit: 100,
    start: 10
  },
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
  var isClient = !!global.document;

  if(isClient) {
    var newDiv = document.createElement('div');
    var newContent = document.createTextNode(JSON.stringify(res.body));
    newDiv.appendChild(newContent);

    // add the newly created element and its content into the DOM
    document.body.appendChild(newDiv);
  }

  console.log(res.status, res.body);
});

// Interface
exports.readUser = readUser;
