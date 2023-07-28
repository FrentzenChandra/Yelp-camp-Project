const express = require("express");
const router = express.Router({ mergeParams: true });
const { Campground } = require("../models/camp.js");
const { validateReview } = require("../utils/validateReview.js");
const Review = require("../models/review.js");

const reviewValidation = (req, res, next) => {
  const { error } = validateReview(req.body);
  if (error) {
    const errorMessage = error.details.map((el) => el.message).join(",");
    throw new Error(errorMessage);
  } else {
    next();
  }
};
// Routes Post And Put

router.post("/", reviewValidation, async (req, res) => {
  const { id } = req.params;
  const review = new Review(req.body);
  await review.save();
  const campground = await Campground.findById(id);
  campground.reviews.push(review);
  await campground.save();
  req.flash('success','Review sudah ditambahkan!!!');
  res.redirect(`/campground/${id}`);
});

// Routes delete

router.delete("/:idReview", async (req, res) => {
  const { id, idReview } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: idReview } });
  const review = await Review.findByIdAndDelete(idReview);
  req.flash('success','Sukses menghapus review!!!')
  res.redirect(`/campground/${id}`);
});

module.exports = router;
