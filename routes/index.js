var express = require("express");
var router  = express.Router();

var mongoose = require("mongoose");
var passport = require("passport");

var User = require("../models/user.js");
// var middleware = require("../middleware");
// var moment = require("moment");
// var async = require("async");
var flash = require("connect-flash");
// var flash = require("express-flash");
// var _ = require("underscore");

router.get("/pp", function(req,res){
	req.flash("error", "pp yoo");
	res.redirect("/");
})

router.get("/login", function(req,res){
	res.render("login");
})


router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/login",
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res){

});

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "See you next time ...");
    res.redirect("/");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

// handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect ("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to GM, " + user.username);
           res.redirect("/"); 
        });
    });
});

module.exports = router;



