var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var methodOverride = require("method-override");

var mongoose = require("mongoose");
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;

var User = require("./models/user");

var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");
var appConfig = require('./config/service.js');

mongoose.connect(appConfig.getProperty("mongo_connect_url"));

var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
// app.use(passport.session());

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  User.authenticate()
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new JWTStrategy({
    jwtFromRequest: req => { console.log("req from jwtStrategy ", req.headers); return req.headers.token },
    secretOrKey   : appConfig.getProperty("secret_key")
  },
  function (jwtPayload, cb) {
    console.log("jwtPayload ", jwtPayload);
    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    return User.findById(jwtPayload.id)
      .then(user => {
          return cb(null, user);
      })
      .catch(err => {
          return cb(err);
      });
  }
));

// auth setup end .. 

app.set('port', (process.env.PORT || 2001));

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({
    extended: true
}));

// parse application/json
app.use(bodyParser.json())

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

app.get("*", function(req, res) {
	res.send("404");
})

// tell express to listen for requests.
app.listen(app.get('port'), function(){
	console.log("server has started");
});

