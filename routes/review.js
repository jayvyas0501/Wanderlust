const express = require("express");
const reviewRouter = express.Router({ mergeParams: true });//:id is comming from parent req.params so for passing to child we have to set mergeParams true
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview} = require("../utils/validateListing.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

reviewRouter.use(express.urlencoded({ extended: true }));


reviewRouter.post(
    "/",
    validateReview,
    wrapAsync(async (req, res) => {
      console.log(req.params)
      const listing = await Listing.findById(req.params.id);
      const newReview = new Review(req.body.review);
      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
  
      console.log("saving new review");
      res.redirect(`/listings/${listing._id}`);
    })
  );
  
  //Delete review Route
  reviewRouter.delete(
    "/:reviewId",
    wrapAsync(async (req, res) => {
      const { id, reviewId } = req.params;
      await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
      await Review.findByIdAndDelete(reviewId);
  
      res.redirect(`/listings/${id}`);
    })
  );
  
  module.exports = reviewRouter;