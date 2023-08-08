const campgrounds = require("../controllers/campground.js");
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils & midleware/catchAsync.js");
const { isAuthor, campgroundValidation, isLoggedIn } = require("../utils & midleware/middleware.js");


router.get("/", campgrounds.index);

router.get("/new", isLoggedIn, campgrounds.new);

router.route("/:id/edit")
.get(isLoggedIn, isAuthor, campgrounds.edit)
.put(campgroundValidation, isLoggedIn, isAuthor, catchAsync(campgrounds.updateCampground));

router.get("/:id", catchAsync(campgrounds.show));


router.post("/new", campgroundValidation, isLoggedIn, catchAsync(campgrounds.postNewCampground));



router.delete("/:id/delete", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
