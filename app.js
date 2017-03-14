var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var cors = require('cors');
var config = require("./config/config");
var ipfilter = require('express-ipfilter');

var routes = require('./routes/index');
var users = require('./routes/users');
var pushConfig = require('./config/pushConfig');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));

app.use(bodyParser.urlencoded({limit: '5mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/kryptosds",express.static(path.join(__dirname, 'public')));
app.use(cors());

var ips = ['127.0.0.1', '10.2.5.18'];


// Allow only whitelisted ips.
//
//app.use(ipfilter(ips,{mode:'allow'}));
app.use(function(req, res, next){
  res.locals.api = config.api;
  next();
});

app.use('/kryptosds', routes);
// app.use('/users', users);
//require("./routes/api")(app);
app.use('/kryptosds', require("./routes/api"));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
