const PORT = 8080;
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var config = require('./config/database')
var movieR = require('./routes/movie_router');
var userR = require('./routes/user_router');

mongoose.connect(config.database);
var db = mongoose.connection;

db.once('open', function(){
  console.log('Connected to mongodb');
}).on('error', function(err){
  console.log('Error connecting to mongodb');
})

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Session id saved in cookie on the client and data saved on server
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {},
}));

require("./config/passport")(passport)
//The initialize() method initializes the authentication module across our app.
app.use(passport.initialize());
//The session() middleware alters the request object and is able to attach a ‘user’ value that can be retrieved from the session id.
app.use(passport.session());


var Movie = require('./models/movieSchema');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Wildcard route to allow user to be
// used in templates
app.get("*", function(req, res, next){
  res.locals.user = req.user || null;
  next();
})

app.use("/movie", movieR);
app.use("/user", userR);


app.use('/', function(req, res){
  Movie.find({},function(err,movies){
    if(err){
      console.log("error!")
    }else{
      res.render("index",{
        title: "Movies",
        movies: movies
      })
    }
  })
})


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
  res.render('error');
});

app.listen(PORT, () => console.log(`IT'S WORKING on http://localhost:${PORT}`));
module.exports = app;