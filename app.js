require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const engine=require("ejs-mate");
const logger = require('morgan');
const passport=require("passport");
const passportLocal=require("passport-local");
const session=require("express-session");
const User=require("./models/user.js");
const mongoose=require("mongoose");


const methodOverride=require("method-override");
/*const seeds=require("./seeds.js");
seeds()*/

           /*routes*/
const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const reviewRouter = require('./routes/review');
const app = express();

/*database connect with mongoose*/

mongoose.connect("mongodb://localhost/surfBoard", { 
  useNewUrlParser: true ,
useCreateIndex:true
} );

// view engine setup
mongoose.set('useFindAndModify', false);
// use ejs-locals for all ejs templates:// use ejs-locals for all ejs templates:
app.engine("ejs",engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(methodOverride("_method"));

app.use(express.urlencoded({extended:true}));  //bodyparser now body parser is in express

app.use(logger('dev'));  
app.use(express.json());
app.use(express.urlencoded({ extended: false }));   
app.use(cookieParser());
app.use(express.static(__dirname+'/public')); //path for public dir



/*Oauth (before routes)*/

app.use(session({
  secret: 'Surfboard',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.title="Surfboard $";
  /*req.user={
          "_id" :"5d24d1efe9bde80dcc324145",
          "username" : "vikram2"
  }*/
 /* req.user={
          "_id" :"5d236deaeb45da1ca8f2ae01",
          "username" : "vikram"
  }
 */ 
  res.locals.query=null;
  res.locals.currentUser=req.user;
  res.locals.moment=require('moment');

  res.locals.success=req.session.success;
  delete req.session.success;
  
  res.locals.error=req.session.error;
  delete req.session.error;
  next()
})



/*route setup*/
app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/posts/:id/review', reviewRouter);


// error handler
app.use(function(err, req, res, next) {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  console.log(err);
  req.session.error = err.message;
  res.redirect('back');
});

module.exports = app;
