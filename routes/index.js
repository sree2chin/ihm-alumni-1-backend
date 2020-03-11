var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var jwt = require('jsonwebtoken');

// sample request
// request("https://www.google.com", function(error, response, body){
//  if(error) {
//      console.log("some thing went wrong", error);
//  } else {
//      if(response.statusCode == 200) {
//          console.log("worked");
//          console.log(body);
//      } else {
//          console.log("failed");
//      }
//  }
// })

// Depricate
// app.get("/dog", function(req, res) {
//  res.send("Hello dog");
// })

router.get("/", passport.authenticate('jwt', {session: false}), function(req, res) {
    res.render("index");
});
//         Auth routes

//show signup form
router.get("/register", function(req, res) {
    res.render("users/register");
});

router.post("/register", function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var newUser = new User({username});
    User.register(newUser, password, function(err, user){
        if(err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("register"); 
        } else {
            passport.authenticate("local", {session: false}, (err, user, info) => {
                // req.flash("success", "Welcome to YelpCamp " + user.username);
                // const token = jwt.sign(JSON.stringify({username, password}), "ihm-alumni-1");
                // /** assign our jwt to the cookie */
                // res.cookie('jwt', token, { httpOnly: true, secure: true });
                // res.status(200).send({ token });

                req.login(user, {session: false}, (err) => {
                    if (err) {
                        res.send(err);
                    }
                    // generate a signed son web token with the contents of user object and return it in the response
                    console.log("user.id ", user.id);
                    console.log("email ", user.username);
                    const token = jwt.sign({ id: user.id, email: user.username}, 'ihm-alumni-1');
                    return res.json({user: user.username, token});
                });
            })(req, res)
        }
    });
    // res.send("register post route");
});

// login routes
router.get("/login", function(req, res) {
    res.render("users/login");
});

router.post(
    "/login", (req, res) => {
        passport.authenticate("local", {
            successRedirect: "/campgrounds",
            failureRedirect: "/login"
        }, (err, user) => {
            const token = jwt.sign(JSON.stringify(user), "ihm-alumni-1");

            /** assign our jwt to the cookie */
            res.cookie('jwt', token, { httpOnly: true, secure: true });
            res.status(200).send({ token });
        })(req, res),
        function(req, res) {
            console.log("In login route");
        }
    }
    
);

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!")
    res.redirect("/campgrounds");
});

// middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

//         Auth routes XXX  

router.get("/dynamic/:dynamic", function(req, res) {
    console.log(req.params);
    res.send("dynamic");
})

router.get("/test-connection", function(req, res) {
    res.send({status: 200, success: true, server: "ihm-alumni-1-backend"});
});

router.get("/test-connection2", passport.authenticate('jwt', {session: false}), function(req, res) {
    res.send({status: 200, success: true, server: "ihm-alumni-1-backend"});
});

module.exports = router;
