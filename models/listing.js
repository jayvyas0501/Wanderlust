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
        type: String,
        default: "https://cdn.pixabay.com/photo/2021/08/25/20/42/field-6574455_640.jpg",
        set: (v) =>
            v === "" ? "https://cdn.pixabay.com/photo/2021/08/25/20/42/field-6574455_640.jpg" : v,
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
