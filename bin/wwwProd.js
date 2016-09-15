/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('ak:server');
var http = require('http');
var https = require('https');
var fs = require('fs');
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '443');
app.set('port', 443);

/**
 * Create HTTP server.
 */

//var server = http.createServer(app);
var options = {
  key: fs.readFileSync('push.kryptosmobile.com/server.key'),
  cert: fs.readFileSync('push.kryptosmobile.com/server.crt'),
  ca : [fs.readFileSync('push.kryptosmobile.com/gdig2.crt'), fs.readFileSync('push.kryptosmobile.com/gd_bundle-g2-g1.crt')]
  };
var server = https.createServer(options, app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {

  

  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

https.createServer(options, function (req, res) {
  res.writeHead(200);
  //res.end("Welcome to Kryptos Push Node Server.");
}).listen(8484);

/*var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('/opt/certs/example.com.key'),
  cert: fs.readFileSync('/opt/certs/example.com.crt')
};

https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("Kryptos Push Server");
}).listen(8080);
*/