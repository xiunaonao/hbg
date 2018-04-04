var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var api = require('./routes/api');
var index = require('./routes/index');
var users = require('./routes/users');
var order = require('./routes/order');
var package = require("./package.json");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req,res,next){
  res.locals._v=package.version;
  console.log(res.locals._v);

	//console.log(req.cookies);
  //res.locals._name='全局通用';
  if(req.cookies && req.cookies['hbg_user']){
    res.locals._user=JSON.parse(req.cookies['hbg_user']);
  }else{
    res.locals._user=null;
  }
	next();
});
app.use('/', index);
app.use('/users',function(req,res,next){
  if(req.cookies && req.cookies['hbg_user'])
    next();
  else{
    res.redirect("/login?url=/users"+req.url);
  }
});
app.use('/order',function(req,res,next){
  if(req.cookies && req.cookies['hbg_user'])
    next();
  else{
    res.redirect("/login?url=/users"+req.url);
  }
});

app.use('/users',users);

app.use('/order', order);
app.use('/api', api);



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
  res.render('error');
});

module.exports = app;
