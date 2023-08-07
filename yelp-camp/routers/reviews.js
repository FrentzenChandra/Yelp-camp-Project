const express = require("express");
const router = express.Router({ mergeParams: true });
const { Campground } = require("../models/camp.js");
const Review = require("../models/review.js");
const { reviewValidation, isLoggedIn } = require("../utils & midleware/middleware.js");

// Routes Post And Put
router.post("/", isLoggedIn, reviewValidation, async (req, res) => {
  const { id } = req.params;
  const { body, rating } = req.body;
  const review = new Review({ body, rating, user: req.user.id });
  await review.save();
  const campground = await Campground.findById(id);
  campground.reviews.push(review);
  await campground.save();
  req.flash("success", "Review sudah ditambahkan!!!");
  res.redirect(`/campground/${id}`);
});

// Routes delete

router.delete("/:idReview", isLoggedIn ,async (req, res) => {
  const { id, idReview } = req.params;
  const campground = await Campground.findById(id).populate("user");
  const review = await Review.findById(idReview).populate('user');
  if(!(campground.user.id == review.user.id)){
    req.flash('error','You do not have permission to do that');
    return res.redirect(`/campground/${id}`);
  }
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: idReview } });
  await Review.findByIdAndDelete(idReview);
  req.flash("success", "Sukses menghapus review!!!");
  res.redirect(`/campground/${id}`);
});

module.exports = router;
