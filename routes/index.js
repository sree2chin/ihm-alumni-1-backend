var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var jwt = require('jsonwebtoken');

router.get("/", passport.authenticate('jwt', {session: false}), function(req, res) {
    res.render("index");
});

// no authentication needed here
router.get("/v1/api/profile/:username", function(req, res) {
    console.log("req.params ", req.params);
    User.findByUsername(req.params.username, (err, user) => {
        res.send({status: 200, ...JSON.parse(JSON.stringify(user))});
    });
});

//         Auth routes
router.post("/v1/api/register", function(req, res) {
    console.log("req.body ", req.body);
    var username = req.body.username;
    var password = req.body.password;
    var name = req.body.name;
    var college = req.body.college;
    var newUser = new User({
        username, name, type: "client", data: { college }
    });
    User.register(newUser, password, function(err, user){
        if(err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("register"); 
        } else {
            passport.authenticate("local", {session: false}, (err, user, info) => {
                if (err) {
                    console.log("register call failure user ");
                    res.send(err);
                } else {
                    const userObj = JSON.parse(JSON.stringify(user));
                    if (userObj.hash) delete userObj.hash;
                    if (userObj.salt) delete userObj.salt;
                    // generate a signed son web token with the contents of user object and return it in the response
                    const token = jwt.sign({ id: user.id, email: user.username}, 'ihm-alumni-1');
                    return res.json({ ...userObj, token});
                }
            })(req, res)
        }
    });
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
                    console.log("login user ", user);
                    const userObj = JSON.parse(JSON.stringify(user));
                    if (userObj.hash) delete userObj.hash;
                    if (userObj.salt) delete userObj.salt;
                    // generate a signed son web token with the contents of user object and return it in the response
                    const token = jwt.sign({ id: user.id, email: user.username}, 'ihm-alumni-1');
                    console.log("login user userObj", userObj);
                    return res.json({ ...userObj, token});
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
