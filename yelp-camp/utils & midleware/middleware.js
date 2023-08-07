const ExpressError = require('./expressError.js'); 
const { Campground } = require("../models/camp.js");
const {validateReview} = require('./validateReview.js');

module.exports.campgroundValidation = (req, res, next) => {
  const { error } = validateCampground(req.body);
  if (error) {
    const errorMessage = error.details.map((el) => el.message).join(",");
    throw new ExpressError(errorMessage);
  } else {
    next();
  }
};


module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate("user");
  const userId = req.user.id;
  console.log(req.user && !(userId == campground.user.id));
  if (!(userId == campground.user.id)) {
    req.flash("error", "You do not have Permission to do That");
    return res.redirect(`/campground/${id}`);
  }
  next();
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You Have to login first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.reviewValidation = (req, res, next) => {
  const { error } = validateReview(req.body);
  if (error) {
    const errorMessage = error.details.map((el) => el.message).join(",");
    throw new ExpressError(errorMessage);
  } else {
    next();
  }
};