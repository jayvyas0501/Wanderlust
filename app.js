const express = require("express");
const path = require("node:path");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session"); 
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { log } = require("node:console");


//!-------------Routes----------------
const homeRouter = require("./routes/home.router.js");
const listingsRouter = require("./routes/listings.router.js");
const reviewRouter = require("./routes/review.router.js");
const userRouter = require("./routes/user.router.js");

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

const sessionOptions = {
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        expires: Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
     }
}
app.use("/",homeRouter);                //? Home routes


//!----------------------passport set-up-------------------
app.use(session(sessionOptions));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());//needs session because user needs to be identified while browsing through page to page
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})

// app.use("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "demouser",
        
//     });
//     const regUseer = await User.register(fakeUser,"helloworld");
//     res.send(regUseer);
// })



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Started Successfully at http://localhost:${PORT}`);
});

//!-----------------Routes---------------------
app.use("/listings", listingsRouter);    
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter)





app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

app.use((err,req,res,next)=>{
    const {statusCode = 500, message ="something went wrong!"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
})

