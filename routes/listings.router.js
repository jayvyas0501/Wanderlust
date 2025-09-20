const express = require("express");
const listingsRouter = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listings.controller.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const upload = require("../middleware/upload.js");

listingsRouter
  .route('/')
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'), // multer memory upload
    wrapAsync(listingController.createListing)
  );


listingsRouter.get("/new", isLoggedIn, listingController.renderNewForm);

// search
listingsRouter.get("/search", wrapAsync(listingController.searchProp));

// category filter
listingsRouter.get("/category/:category", wrapAsync(listingController.filterByCategory));

// dynamic id routes (after specific ones)
listingsRouter
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, upload.single("listing[image]"), wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

listingsRouter.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = listingsRouter;
