const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Define the main listing schema
const reviewSchema = new Schema({
    comment:String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
        // required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:"user"
    }
});



module.exports = mongoose.model("Review", reviewSchema);
