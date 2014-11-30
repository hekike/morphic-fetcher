var Fetcher = require('../../');

/*
 * Add response to DOM
 *
 * @method addResponseToDOM
 * @param {Object} res
 */
function addResponseToDOM (res) {
  var newDiv = document.createElement('div');
  var newContent = document.createTextNode(JSON.stringify(res.body));

  newDiv.appendChild(newContent);
  document.body.appendChild(newDiv);
}


/*
 * readUserFetcher
 *
 * @method readUserFetcher
 * @param {Object} server
 */
function readUserFetcher (server) {
  var read = new Fetcher(server, {
    method: 'post',
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

    // Add to dom on the client
    if(isClient) {
      addResponseToDOM(res);
    }

    // Log to console
    console.log(res.body);
  });
}


// Interface
exports.readUserFetcher = readUserFetcher;
global.readUserFetcher = readUserFetcher;
