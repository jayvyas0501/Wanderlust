const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  console.log(req.params);
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview);
  
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "new Review saved");
  console.log("saving new review");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Delted!");
  res.redirect(`/listings/${id}`);
};
