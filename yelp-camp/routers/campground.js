const campgrounds = require("../controllers/campground.js");
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils & midleware/catchAsync.js");
const { isAuthor, campgroundValidation, isLoggedIn } = require("../utils & midleware/middleware.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/", campgrounds.index);

router
  .route("/new")
  .get(isLoggedIn, campgrounds.new)
  .post(upload.array("upload"),(req, res) => {
    console.log(req.body, req.files);
    res.send("ok");
  });

// .post( campgroundValidation, isLoggedIn, catchAsync(campgrounds.postNewCampground));

router.route("/:id/edit").get(isLoggedIn, isAuthor, campgrounds.edit).put(campgroundValidation, isLoggedIn, isAuthor, catchAsync(campgrounds.updateCampground));

router.get("/:id", catchAsync(campgrounds.show));

router.delete("/:id/delete", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
