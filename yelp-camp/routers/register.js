const express = require("express");
const router = express.Router();
const { User } = require("../models/user.js");
const catchAsync = require("../utils/catchAsync.js");
const passport = require("passport");
const { storeReturnTo } = require("../utils/returnTo.js");

router.get("/register", (req, res) => {
  res.render("register.ejs");
});

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.get("/logout", (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("error", "You Have logged Out");
    res.redirect("/login");
  });
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Yelp-Camp");
        res.redirect("/campground");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.post("/login", storeReturnTo , passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
  const redirectUrl = res.locals.returnTo || '/campground';
  req.flash("success", "Welcome Back!!!");
  res.redirect(redirectUrl);
});

module.exports = router;
