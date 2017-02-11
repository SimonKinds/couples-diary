const http = require('http');

const server = http.createServer(function(request, response) {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/html');
  response.end('<html><body><p>Hello world!</p></html>');
});

server.listen(8080);
