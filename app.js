require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser=require("body-parser");
const logger = require('morgan');
const passport=require("passport");
const passportLocal=require("passport-local");
const session=require("express-session");
const User=require("./models/user.js");
const mongoose=require("mongoose");
const methodOverride=require("method-override");

           /*routes*/
const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const reviewRouter = require('./routes/review');
const app = express();

/*database connect with mongoose*/

mongoose.connect("mongodb://localhost/surfBoard", { useNewUrlParser: true } );

// view engine setup
mongoose.set('useFindAndModify', false);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));  //bodyparser
app.use(logger('dev'));  
app.use(express.json());
app.use(express.urlencoded({ extended: false }));   
app.use(cookieParser());
app.use(express.static(__dirname+'/public')); //path for public dir

/*Oauth (before routes)*/
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  secret: 'Surfboard',
  resave: false,
  saveUninitialized: false
}))

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



/*route setup*/
app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/posts/:id/review', reviewRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error.ejs');
});

module.exports = app;
