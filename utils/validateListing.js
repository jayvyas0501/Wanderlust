const {listingSchema} = require("../schema");
const ExpressError = require("./ExpressError")
const validateListing = (req,res,next)=>{
    const {error} = listingSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next()
    }
  }

  module.exports = validateListing;