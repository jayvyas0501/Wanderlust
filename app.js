const express = require("express");
const path = require("node:path");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const homeRouter = require("./routes/home.js");
const listingsRouter = require("./routes/listings.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const reviewRouter = require("./routes/review.js");

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
app.use("/",homeRouter);                // Home routes
app.use("/listings", listingsRouter);    // Listings routes
app.use("/listings/:id/reviews", reviewRouter);





app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

app.use((err,req,res,next)=>{
    const {statusCode = 500, message ="something went wrong!"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
})

