const express = require("express");
const router = express.Router();
const catchAsync = require("../utils & midleware/catchAsync.js");
const { Campground } = require("../models/camp.js");
const { isAuthor, campgroundValidation ,isLoggedIn} = require("../utils & midleware/middleware.js");


// routes get
router.get("/", async (req, res, next) => {
  const campgrounds = await Campground.find({}).populate("user");
  res.render("campground/allCampground.ejs", { campgrounds });
  console.log(res.locals.user);
});

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campground/new.ejs");
});

router.get("/:id/edit", isLoggedIn, isAuthor, async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campground/edit.ejs", { campground });
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews").populate("user");
    if (campground && campground.id == id) {
      return res.render("campground/show.ejs", { campground });
    }
    req.flash("error", "Cannot find that campground");
    res.redirect("/campground");
  })
);

// Route put dan post
router.post(
  "/new",
  campgroundValidation,
  isLoggedIn,
  catchAsync(async (req, res) => {
    const user = req.user.id;
    const { title, location, price, description, image } = req.body;
    const campground = new Campground({ title, location, price, description, image, user });
    await campground.save();
    req.flash("success", "Sukses Membuat Camground Baru!!!");
    res.redirect("/campground");
  })
);

router.put(
  "/:id/edit",
  campgroundValidation,
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title, location, price, description, image } = req.body;
    await Campground.findByIdAndUpdate(id, { title, location, price, description, image });
    req.flash("success", "Campground Berhasil diubah!!!");
    res.redirect("/campground");
  })
);

// Routes delete

router.delete(
  "/:id/delete",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Berhasil menghapus campground!!!");
    res.redirect("/campground");
  })
);

module.exports = router;
