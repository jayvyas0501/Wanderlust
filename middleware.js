const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn = (req,res,next)=>{ 
  if(!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing!");
    return res.redirect("/login");
  }
  next()
}

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next()
}

module.exports.isOwner = async(req,res,next)=>{
  const { id } = req.params;
    const listing = await Listing.findById(id);
    // Authorization check
    if (!listing.owner.equals(res.locals._id)) {
      req.flash("error", "You are not authorized to Do that!");
      return res.redirect(`/listings/${id}`);
    }
    next()
}

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

module.exports.isReviewAuthor = async(req,res,next)=>{
  const {id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    // Authorization check
    if (!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not authorized to Do that!");
      return res.redirect(`/listings/${id}`);
    }
    next()
}
