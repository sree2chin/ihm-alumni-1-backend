var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
// index.js is special that it will be automatically included if path is specified.
var middleware = require("../middleware"); // ../middleware is equal to ../middleware/index.js

router.get("/campgrounds", function(req, res) {
	// Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds",{campgrounds:allCampgrounds, currentUser: req.user});
       }
    });
	// res.render("campgrounds", {campgrounds: campgrounds});
});

router.get("/campgrounds-test", function(req, res) {
	// Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.send({campgrounds:allCampgrounds});
       }
    });
	// res.render("campgrounds", {campgrounds: campgrounds});
});

router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

router.post("/campgrounds", middleware.isLoggedIn,  function(req, res){
	console.log("==============================");
	console.log(req.body);
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {}
    var newCampground = {name: name, price: price, image: image, description: desc, author:author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// SHOW - shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
}) 

// EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});

module.exports = router;

