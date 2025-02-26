// const { isLoggedIn } = require("../middleware");
const mongoose = require("mongoose");
const Listing = require("../models/listing");


module.exports.index = async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index.ejs", { allListing: allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings"); // ✅ Stops execution
  }
  console.log(listing);
  
  res.render("listings/show.ejs", { listing });
  
};

module.exports.createListing = async (req, res, err) => {
  const url = req.file.path;
  const filename = req.file.filename;
  console.log(url+"..."+filename);
  // const newListing = new Listing(req.body.listing);
  // newListing.owner = req.user._id;
  // await newListing.save();
  req.flash("success", "new Listing saved");
  res.redirect("/listings");
  // next(err);
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings"); // ✅ Stops execution
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  // Log req.params to debug
  // console.log("req.params:", req.params);

  const { id } = req.params; // Extract id from req.params
  if (!id) {
    req.flash("error", "No listing ID provided!");
    return res.redirect("/listings");
  }

  try {
    const listing = await Listing.findById(id);
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Error in updateListing:", err);
    req.flash("error", "Something went wrong while updating the listing!");
    }
};
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const deletedList = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  console.log(deletedList);
  res.redirect("/listings");
};
