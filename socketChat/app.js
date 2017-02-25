
global.rootPath = __dirname;
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);


var index = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');
var logout = require('./routes/logout');

var app = express();


var store = new MongoDBStore(   //session存入mongodb 解决服务器重启保持登录状态
    {
        uri: 'mongodb://localhost:27017/socket_chat',
        collection: 'sessions'
    });

// Catch errors  监控session存入错误
store.on('error', function(error) {
    assert.ifError(error);
    assert.ok(false);
});


// view engine setup  ejs配置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(
    {
        store: store,  //持久化
        cookie:{maxAge:1000*60*60*24*7},
        name:'sid',
        secret:'hello world',
        resave: true,
        saveUninitialized: true
    }
));



app.use('/', login);
app.use('/index',index);
app.use('/register',register);
app.use('/login',login);
app.use('/logout',logout);




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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
