// controllers/listings.controller.js
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const sharp = require('sharp');
const { cloudinary } = require("../cloudConfig");

// helper: escape regex to avoid injection / accidental special chars
function escapeRegex(text = "") {
  // escape regex special chars but allow spaces
  return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
}

module.exports.index = async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index.ejs", { allListing: allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  try {
    if (!req.file) {
      req.flash('error', 'Image is required');
      return res.redirect('/listings/new');
    }

    // Compress & resize image
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 1200 })   // max width
      .jpeg({ quality: 70 })     // compress
      .toBuffer();

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'wanderlust_DEV', format: 'jpg' },
        (err, uploaded) => (err ? reject(err) : resolve(uploaded))
      );
      stream.end(buffer);
    });

    // Save Listing
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url: result.secure_url, filename: result.public_id };
    await newListing.save();

    req.flash('success', 'New listing saved');
    res.redirect('/listings');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong while creating the listing');
    res.redirect('/listings/new');
  }
};


module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    req.flash("error", "No listing ID provided!");
    return res.redirect("/listings");
  }

  try {
    if (!req.body.listing) {
      req.flash("error", "Listing data is missing!");
      return res.redirect(`/listings/${id}/edit`);
    }

    // Extract listing data from request
    const { title, description, price, location, country, category, tags } = req.body.listing;

    // Find listing by ID
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // Update fields
    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.location = location;
    listing.country = country;
    listing.category = category;

    // Tags: ensure it's an array, even if single tag or empty
    listing.tags = Array.isArray(tags) ? tags : tags ? [tags] : [];

    // Image: if new file uploaded, update
    if (req.file) {
      const url = req.file.path;
      const filename = req.file.filename;
      listing.image = { url, filename };
    }

    await listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Error in updateListing:", err);
    req.flash("error", "Something went wrong while updating the listing!");
    res.redirect("/listings");
  }
};



module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

// search route (supports AJAX)
module.exports.searchProp = async (req, res) => {
  // support both ?q= and ?query= for flexibility
  const query = req.query.q || req.query.query;
  if (!query) {
    if (req.xhr || (req.headers.accept && req.headers.accept.includes("application/json"))) {
      return res.json({ results: [] });
    }
    req.flash("error", "Please enter a search term");
    return res.redirect("/listings");
  }

  const results = await Listing.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
    ],
  });

  if (req.xhr || (req.headers.accept && req.headers.accept.includes("application/json"))) {
    return res.json({ results });
  }

  res.render("listings/searchResults", { results, query });
};

// category filter (supports AJAX JSON)
module.exports.filterByCategory = async (req, res) => {
  const category = req.params.category || "";
  const safe = escapeRegex(category);
  const regex = new RegExp("^" + safe + "$", "i");

  const listings = await Listing.find({ category: regex });

  // If AJAX/json requested, return JSON (even if empty)
  if (req.xhr || (req.headers.accept && req.headers.accept.includes("application/json"))) {
    return res.json({ listings });
  }

  // Normal request: if none, use flash + redirect
  if (listings.length === 0) {
    req.flash("error", `No listings found for "${category}"`);
    return res.redirect("/listings");
  }

  res.render("listings/index.ejs", { allListing: listings });
};
