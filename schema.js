const joi = require("joi");
module.exports.listingSchema = joi.object({
    title: joi.string().trim().max(100).required().messages({
        "string.empty": "Title cannot be empty",
        "any.required": "Title is required"
    }),
    description: joi.string().trim().max(1000).required(),
    price: joi.number().min(0).required(),
    location: joi.string().trim().max(100).required(),
    country: joi.string().trim().max(100).required(),
    image: joi.string().optional()
}).required()



module.exports.reviewSchema = joi.object({
    review : joi.object({
        rating :  joi.number().required().min(1).max(5),
        comment : joi.string().required(),
    }).required()
})