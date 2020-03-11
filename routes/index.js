var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var jwt = require('jsonwebtoken');

router.get("/", passport.authenticate('jwt', {session: false}), function(req, res) {
    res.render("index");
});

//         Auth routes
router.post("/v1/api/register", function(req, res) {
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
                if (err) {
                    res.send(err);
                } else {
                    // generate a signed son web token with the contents of user object and return it in the response
                    console.log("user.id ", user.id);
                    console.log("email ", user.username);
                    const token = jwt.sign({ id: user.id, email: user.username}, 'ihm-alumni-1');
                    return res.json({user: user.username, token});
                }
            })(req, res)
        }
    });
    // res.send("register post route");
});

router.post(
    "/v1/api/login", (req, res) => {
        try {
            if (!req.body.username || !req.body.password) {
                return res.status(400).json({
                    message: 'Something is not right with your input'
                });
            }
            passport.authenticate('local', {session: false}, (err, user, info) => {
                if (err || !user) {
                    return res.status(400).json({
                        message: 'Something went wrong, please try again',
                        user   : user
                    });
                } else {
                    if (err) {
                        res.send(err);
                    }
                    console.log("user.id ", user.id);
                    console.log("email ", user.username);
                    const token = jwt.sign({ id: user.id, email: user.username}, 'ihm-alumni-1');
                    return res.json({user: user.username, token});
                }
            })(req, res);
        }
        catch(err){
            console.log(err);
            return res.status(501).json({
                message: 'Something went wrong, please try again'
            });
        }
    }
);

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
