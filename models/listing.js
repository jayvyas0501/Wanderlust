const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Define the main listing schema
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url:String,
        filename:String,
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
