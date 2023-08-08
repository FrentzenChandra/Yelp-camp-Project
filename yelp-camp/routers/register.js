const express = require("express");
const router = express.Router();
const catchAsync = require("../utils & midleware/catchAsync.js");
const { storeReturnTo } = require("../utils & midleware/returnTo.js");
const register = require('../controllers/register.js');
const passport = require("passport");


router.route("/register")
  .get(register.index)
  .post(catchAsync(register.newUser));


router.route("/login")
.get(register.login)
.post(storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), register.redirect);;

router.get("/logout", register.logout);




module.exports = router;
