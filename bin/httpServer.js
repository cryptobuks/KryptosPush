var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('push.kryptosmobile.com/server.key'),
  cert: fs.readFileSync('push.kryptosmobile.com/server.crt')
};

https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("Welcome to Kryptos Push Node Server.");
}).listen(8484);
console.log('Server running at push.kryptosmobile.com:8080/');