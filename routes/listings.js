const express = require("express");
const Listing = require("../models/listing.js");
// const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
const { listingSchema ,reviewSchema} = require("../schema.js");
const {
  validateListing,
} = require("../utils/validateListing.js");
const Review =require("../models/review.js")
const listingsRouter = express.Router();

// Fetch all listings
listingsRouter.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListing: allListings });
  })
);
listingsRouter.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, err) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    next(err);
  })
);

// Render the form to create a new listing

listingsRouter.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Create a new listing
listingsRouter.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

listingsRouter.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    
    res.redirect(`/listings/${id}`);
  })
);

listingsRouter.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/listings");
  })
);

//Reveiws
//post review route

// Fetch a specific listing by ID
listingsRouter.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

module.exports = listingsRouter;
