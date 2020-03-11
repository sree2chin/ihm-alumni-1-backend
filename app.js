var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var passport = require("passport");
var methodOverride = require("method-override");

var mongoose = require("mongoose");
var flash = require("connect-flash");
var session = require('express-session');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;

var User = require("./models/user");

var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

// mongoose.connect("mongodb://sree2chin:sree2chin@ds111124.mlab.com:11124/yelpcamp");
mongoose.connect("mongodb+srv://sree2chin:sree2chin@ihm-alumni-1-ccuob.gcp.mongodb.net/test?retryWrites=true&w=majority");

// auth setup
app.use(session({
    secret: "could be anything",
    resave: false,
    saveUninitialized: false
}))

app.use(flash());
var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());

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
    secretOrKey   : 'ihm-alumni-1'
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

// Middleware this will let the currentUser obj available in ejs..IMP******
app.use(function(req, res, next){
    console.log("req sess ========= ", JSON.stringify(req.session));
    console.log("req user ========= ", req.user);
    res.locals.currentUser = req.user; 
    res.locals.error = req.flash("error"); 
    res.locals.success = req.flash("success"); 
    next(); 
});
// Middleware IMP end XXXX

app.set('port', (process.env.PORT || 2001));

app.use(express.static(__dirname + '/public')); 

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

