const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync.js");
const { Campground } = require("../models/camp.js");
const { validateCampground } = require("../utils/validateCampground.js");

const campgroundValidation = (req, res, next) => {
  const { error } = validateCampground(req.body);
  if (error) {
    const errorMessage = error.details.map((el) => el.message).join(",");
    throw new Error(errorMessage);
  } else {
    next();
  }
};

// routes get
router.get("/", async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campground/allCampground.ejs", { campgrounds });
});

router.get("/new", (req, res) => {
  res.render("campground/new.ejs");
});

router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campground/edit.ejs", { campground });
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    res.render("campground/show.ejs", { campground });
  })
);

// Route put dan post
router.post(
  "/new",
  campgroundValidation,
  catchAsync(async (req, res) => {
    const { title, location, price, description, image } = req.body;
    const campground = new Campground({ title, location, price, description, image });
    await campground.save();
    res.redirect("/campground");
  })
);

router.put(
  "/:id/edit",
  campgroundValidation,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { title, location, price, description, image } = req.body;
    await Campground.findByIdAndUpdate(id, { title, location, price, description, image });
    res.redirect("/campground");
  })
);

// Routes delete

router.delete(
  "/:id/delete",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campground");
  })
);


module.exports = router;
