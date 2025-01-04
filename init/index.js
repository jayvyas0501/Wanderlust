const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(() => {
    console.log("DB connected");
}).catch((err) => {
    console.error("Failed to connect to DB:", err);
});

async function main() {
    await mongoose.connect(MONGO_URL);  // No need to pass useNewUrlParser or useUnifiedTopology
}

const initDB = async () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data initialized");
}
 
initDB();