const { Campground } = require("../models/camp.js");
const Review = require("../models/review.js");

module.exports.newReview = async (req, res) => {
  const { id } = req.params;
  const { body, rating } = req.body;
  const review = new Review({ body, rating, user: req.user.id });
  await review.save();
  const campground = await Campground.findById(id);
  campground.reviews.push(review);
  await campground.save();
  req.flash("success", "Review sudah ditambahkan!!!");
  res.redirect(`/campground/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, idReview } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: idReview } });
  await Review.findByIdAndDelete(idReview);
  req.flash("success", "Sukses menghapus review!!!");
  res.redirect(`/campground/${id}`);
};
