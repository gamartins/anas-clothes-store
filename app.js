var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('./auth')

var index = require('./routes/index');
var auth = require('./routes/auth');
var users = require('./routes/users');
var clothes = require('./routes/clothes');
var customers = require('./routes/customers');
var sales = require('./routes/sales');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// setup cors
var cors = require('cors')
app.use(cors())

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize())
app.use('/', index)
app.use('/auth', auth)
app.use('/users', users)
app.use('/clothes', clothes)
app.use('/customers', customers)
app.use('/sales', sales)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message: "Internal Server Error" });

  // show console log in development
  req.app.get('env') === 'development' ? console.log(err.message) : '';

});

module.exports = app;
