const express = require("express");
const Listing = require("../models/listing.js");
// const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { validateListing } = require("../middleware.js");
const Review = require("../models/review.js");
const listingController = require("../controllers/listings.controller.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingsRouter = express.Router();

listingsRouter
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(validateListing, wrapAsync(listingController.createListing));

listingsRouter.get("/new", isLoggedIn, listingController.renderNewForm);

listingsRouter
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
  );

listingsRouter.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = listingsRouter;
