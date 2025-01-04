const express = require("express");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js"); 
const validateListing = require("../utils/validateListing.js")
const listingsRouter = express.Router();

// Fetch all listings
listingsRouter.get("/",wrapAsync( async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index.ejs", { allListing: allListings });
}));

// Render the form to create a new listing
listingsRouter.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Create a new listing
listingsRouter.post("/",validateListing, wrapAsync(async (req, res, err) => { 
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
  next(err);

}));

// Fetch a specific listing by ID
listingsRouter.get("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;

  // Validate the ID
  // if (!mongoose.isValidObjectId(id)) {
  //   return res.status(400).send("Invalid listing ID");
  // }

  const listing = await Listing.findById(id);

  // if (!listing) {
  //   return res.status(404).send("Listing not found");
  // }

  res.render("listings/show.ejs", { listing });
}));

module.exports = listingsRouter;
