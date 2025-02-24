const express = require("express");
const reviewRouter = express.Router({ mergeParams: true }); //:id is comming from parent req.params so for passing to child we have to set mergeParams true
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {
  createReview,
  destroyReview,
} = require("../controllers/review.controller.js");

reviewRouter.use(express.urlencoded({ extended: true }));

reviewRouter.post("/",isLoggedIn, validateReview, wrapAsync(createReview));

//Delete review Route
reviewRouter.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(destroyReview));

module.exports = reviewRouter;
