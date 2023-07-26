const express = require("express");
const app = express();
const path = require("path");
const { Campground } = require("./models/camp.js");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const mongoose = require("mongoose");
const catchAsync = require("./utils/catchAsync.js");
const ExpressError = require("./utils/expressError.js");
const { validateCampground } = require("./utils/validateCampground.js");
const { validateReview } = require("./utils/validateReview.js");
const Review = require("./models/review.js");
const campgroundRoutes = require("./routers/campground.js");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}



const reviewValidation = (req, res, next) => {
  const { error } = validateReview(req.body);
  if (error) {
    const errorMessage = error.details.map((el) => el.message).join(",");
    throw new Error(errorMessage);
  } else {
    next();
  }
};

app.engine("ejs", engine);
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/campground", campgroundRoutes);


// Routes get
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// Routes Post And Put


app.post("/campground/:id/review", reviewValidation, async (req, res) => {
  const { id } = req.params;
  const review = new Review(req.body);
  await review.save();
  const campground = await Campground.findById(id);
  campground.reviews.push(review);
  await campground.save();
  res.redirect(`/campground/${id}`);
});

// Routes delete

app.delete("/campground/:id/review/:idReview", async (req, res) => {
  const { id, idReview } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: idReview } });
  const review = await Review.findByIdAndDelete(idReview);
  res.redirect(`/campground/${id}`);
});

// Middleware Ini berlaku ke sebuah router yang tidak diketahui
app.all("*", (req, res) => {
  next(new ExpressError("Page Not Found", 404));
});

// Middleware ini berlaku pada saat terjadi suatu error
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Oh Boy there Something Wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen("8080", (req, res) => {
  console.log("Listen in 8080");
});
