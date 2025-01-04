const express = require("express");
const path = require("node:path");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const homeRouter = require("./routes/home.js");
const listingsRouter = require("./routes/listings.js");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const validateListing = require("./utils/validateListing.js") 


dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

// Connect to MongoDB 
main().then(() => {
    console.log("DB connected");
}).catch((err) => {
    console.error("Failed to connect to DB:", err);
});

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Started Successfully at http://localhost:${PORT}`);
});

// Mount routers
app.use("/", homeRouter);                // Home routes
app.use("/listings", listingsRouter);    // Listings routes


// Define "/listings/new" before "/listings/:id"
app.use("/listings/new",listingsRouter);


// Fetch a listing by ID
app.use("/:id", homeRouter);


app.use("/listings",listingsRouter);


app.get("/listings/:id/edit",wrapAsync( async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing }); 
}));

app.put("/listings/:id",validateListing,wrapAsync( async(req,res)=>{
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id",wrapAsync (async (req,res)=>{
    const { id } = req.params;
    const deletedList =await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/listings");

}));
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

app.use((err,req,res,next)=>{
    const {statusCode = 500, message ="something went wrong!"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
})