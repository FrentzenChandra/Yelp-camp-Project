const express = require("express");
const router = express.Router({ mergeParams: true });
const review = require('../controllers/review.js')
const { reviewValidation, isLoggedIn, isReviewAuthor } = require("../utils & midleware/middleware.js");

// Routes Post And Put
router.post("/", isLoggedIn, reviewValidation, review.newReview);

// Routes delete

router.delete("/:idReview", isLoggedIn, isReviewAuthor, review.deleteReview);

module.exports = router;
