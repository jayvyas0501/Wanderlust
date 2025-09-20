const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the main listing schema
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    url: { type: String, default: "" },
    filename: { type: String, default: "" },
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  category: { 
    type: String, 
    enum: [
      "Trending", "Rooms", "Iconic Cities", "Mountains", "Castles",
      "Pools", "Camping", "Farms", "Arctic", "Domes", "Boats"
    ], 
    default: "Trending",
  },
  tags: {
    type: [String],  // Array of strings
    default: [],
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  }
}, { timestamps: true });

// index tags and category for faster querying
listingSchema.index({ category: 1 });
listingSchema.index({ tags: 1 });

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
