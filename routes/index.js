var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var jwt = require('jsonwebtoken');
var appConfig = require('../config/service.js');

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
    var phoneNumber = req.body.phoneNumber;
    var newUser = new User({
        username,
        name,
        type: "student",
        data: { 
            phoneNumber: phoneNumber
        }
    });
    if (!username || !password || !name || !phoneNumber) {
        return res.status(400).json({ status: 400, message: "Please enter all fields" });
    }
    User.register(newUser, password, function(err, user){
        if(err) {
            return res.json({status: 400, message: "Something went wrong", error: err}); 
        } else {
            passport.authenticate("local", {session: false}, (err, user, info) => {
                if (err) {
                   return res.json({status: 400, message: "Something went wrong with authentication", error: err});
                } else {
                    const userObj = JSON.parse(JSON.stringify(user));
                    if (userObj.hash) delete userObj.hash;
                    if (userObj.salt) delete userObj.salt;
                    // generate a signed son web token with the contents of user object and return it in the response
                    const token = jwt.sign({ id: user.id, email: user.username}, appConfig.getProperty("secret_key"));
                    return res.json({ ...userObj, token});
                }
            })(req, res)
        }
    });
});

router.post("/v1/api/user/update", function(req, res) {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        var newUser = {
            name: req.body.name,
            data: { 
                phoneNumber: req.body.phoneNumber,
                university: req.body.university,
                hallTicketNumber: req.body.hallTicketNumber,
                college: req.body.college,
                course: req.body.course,
                batchStartYear: req.body.batchStartYear,
                batchEndYear: req.body.batchEndYear,
                passOutYear: req.body.passOutYear,
                ignouNumber: req.body.ignouNumber,
                aadhaarNumber: req.body.aadhaarNumber
            }
        };
        User.findByIdAndUpdate(user._id, newUser, { new: true})
          .then(user => {
            const userObj = JSON.parse(JSON.stringify(user));
            if (userObj.hash) delete userObj.hash;
            if (userObj.salt) delete userObj.salt;
            return res.json({ ...userObj });
          })
          .catch(err => {
            return res.status(400).json({ status: 400, message: "Something went wrong" });
          });
    })(req, res);
});

/*
    The verify callback for local authentication accepts username and password arguments,
    which are submitted to the application via a login form.
 */
router.post(
    "/v1/api/login", (req, res) => {
        try {
            if (!req.body.username || !req.body.password) {
                return res.status(400).json({
                    message: 'Please enter all fields'
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
                    const userObj = JSON.parse(JSON.stringify(user));
                    if (userObj.hash) delete userObj.hash;
                    if (userObj.salt) delete userObj.salt;
                    // generate a signed son web token with the contents of user object and return it in the response
                    const token = jwt.sign({ id: user.id, email: user.username}, appConfig.getProperty("secret_key"));
                    return res.json({ ...userObj, token});
                }
            })(req, res);
        }
        catch(err){
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

// test routes
router.get("/test-connection", function(req, res) {
    res.send({status: 200, success: true, server: "backend"});
});

router.get("/test-connection2", passport.authenticate('jwt', {session: false}), function(req, res) {
    res.send({status: 200, success: true, server: "backend"});
});

module.exports = router;
