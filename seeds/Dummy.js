const mongoose = require("mongoose");
const Listing = require("../models/listing");
const User = require("../models/user");

const MONGO_URL = "YOUR_MONGO_URL_HERE";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ MongoDB connected");
}

const seedDB = async () => {
  // Clear existing data
  await Listing.deleteMany({});
  await User.deleteMany({});
  console.log("Old data cleared!");

  // Create a dummy user
  const user = new User({ email: "admin@example.com", username: "admin" });
  await user.setPassword("password123");
  await user.save();
  console.log("User created!");

  // 20 beautiful listings
  const listings = [
    {
      title: "Cozy Mountain Retreat",
      description: "Escape to this serene cabin nestled in the heart of the mountains.",
      price: 4500,
      location: "Manali, Himachal Pradesh",
      category: "Mountains",
      image: { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", filename: "mountain1" },
      owner: user._id
    },
    {
      title: "Luxurious City Loft",
      description: "A stylish and modern loft in the bustling city center.",
      price: 7500,
      location: "Mumbai, Maharashtra",
      category: "Iconic Cities",
      image: { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80", filename: "city1" },
      owner: user._id
    },
    {
      title: "Charming Countryside Cottage",
      description: "Relax in this peaceful cottage surrounded by lush farmland.",
      price: 3500,
      location: "Alibaug, Maharashtra",
      category: "Farms",
      image: { url: "https://images.unsplash.com/photo-1507120366499-24c1fda6a4be?auto=format&fit=crop&w=600&q=80", filename: "farm1" },
      owner: user._id
    },
    {
      title: "Beachfront Paradise Villa",
      description: "Wake up to the sound of waves in this beautiful villa by the sea.",
      price: 9500,
      location: "Goa, India",
      category: "Pools",
      image: { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", filename: "pool1" },
      owner: user._id
    },
    {
      title: "Arctic Igloo Experience",
      description: "Sleep under the Northern Lights in a cozy arctic igloo.",
      price: 12000,
      location: "Svalbard, Norway",
      category: "Arctic",
      image: { url: "https://images.unsplash.com/photo-1581730209486-0d91c78ed8d8?auto=format&fit=crop&w=600&q=80", filename: "arctic1" },
      owner: user._id
    },
    {
      title: "Floating Houseboat",
      description: "Stay on a unique houseboat with stunning water views.",
      price: 6000,
      location: "Alleppey, Kerala",
      category: "Boats",
      image: { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", filename: "boat1" },
      owner: user._id
    },
    {
      title: "Medieval Castle Stay",
      description: "Live like royalty in this fully restored historic castle.",
      price: 20000,
      location: "Edinburgh, Scotland",
      category: "Castles",
      image: { url: "https://images.unsplash.com/photo-1530081970380-0c84b44f998d?auto=format&fit=crop&w=600&q=80", filename: "castle1" },
      owner: user._id
    },
    {
      title: "Luxury Dome Retreat",
      description: "Stay in a futuristic dome with panoramic forest views.",
      price: 8000,
      location: "Rishikesh, Uttarakhand",
      category: "Domes",
      image: { url: "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=600&q=80", filename: "dome1" },
      owner: user._id
    },
    {
      title: "Trendy Loft Apartment",
      description: "Perfect stay for city explorers in a hip neighborhood.",
      price: 5000,
      location: "Bengaluru, Karnataka",
      category: "Trending",
      image: { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80", filename: "trending1" },
      owner: user._id
    },
    {
      title: "Secluded Camping Spot",
      description: "Enjoy the great outdoors with a private camping experience.",
      price: 2500,
      location: "Spiti Valley, Himachal Pradesh",
      category: "Camping",
      image: { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80", filename: "camping1" },
      owner: user._id
    },
    {
      title: "Ocean View Room",
      description: "Relax in a cozy room with spectacular sea views.",
      price: 4000,
      location: "Puri, Odisha",
      category: "Rooms",
      image: { url: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=600&q=80", filename: "room1" },
      owner: user._id
    },
    {
      title: "Modern Apartment in Heart of City",
      description: "Walk everywhere from this stylish city apartment.",
      price: 6500,
      location: "Delhi, India",
      category: "Iconic Cities",
      image: { url: "https://images.unsplash.com/photo-1572120360610-d971b9b63996?auto=format&fit=crop&w=600&q=80", filename: "city2" },
      owner: user._id
    },
    {
      title: "Luxury Poolside Villa",
      description: "Private pool and sun deck for ultimate relaxation.",
      price: 12000,
      location: "Bali, Indonesia",
      category: "Pools",
      image: { url: "https://images.unsplash.com/photo-1580584121783-6c2c4d20a0f3?auto=format&fit=crop&w=600&q=80", filename: "pool2" },
      owner: user._id
    },
    {
      title: "Rustic Farmhouse",
      description: "Experience traditional farm life in comfort and style.",
      price: 3800,
      location: "Coorg, Karnataka",
      category: "Farms",
      image: { url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=600&q=80", filename: "farm2" },
      owner: user._id
    },
    {
      title: "Charming Mountain Cabin",
      description: "Perfect retreat for nature lovers and adventurers.",
      price: 4800,
      location: "Leh, Ladakh",
      category: "Mountains",
      image: { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80", filename: "mountain2" },
      owner: user._id
    },
    {
      title: "Beachfront Dome",
      description: "Unique stay in a dome right on the sandy beach.",
      price: 9000,
      location: "Andaman Islands, India",
      category: "Domes",
      image: { url: "https://images.unsplash.com/photo-1576675784105-f44c8d2377f7?auto=format&fit=crop&w=600&q=80", filename: "dome2" },
      owner: user._id
    },
    {
      title: "Iconic Castle Suite",
      description: "Stay in a luxurious suite inside a famous historic castle.",
      price: 18000,
      location: "Neuschwanstein, Germany",
      category: "Castles",
      image: { url: "https://images.unsplash.com/photo-1530081970380-0c84b44f998d?auto=format&fit=crop&w=600&q=80", filename: "castle2" },
      owner: user._id
    },
    {
      title: "Adventure Camping Tent",
      description: "Enjoy a night under the stars with modern amenities.",
      price: 3000,
      location: "Ranthambore, Rajasthan",
      category: "Camping",
      image: { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80", filename: "camping2" },
      owner: user._id
    },
    {
      title: "Luxury Floating Villa",
      description: "A villa on water with amazing views and privacy.",
      price: 15000,
      location: "Maldives",
      category: "Boats",
      image: { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", filename: "boat2" },
      owner: user._id
    },
    {
      title: "Trendy Urban Loft",
      description: "Hip loft apartment in the heart of a vibrant neighborhood.",
      price: 5200,
      location: "Pune, Maharashtra",
      category: "Trending",
      image: { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80", filename: "trending2" },
      owner: user._id
    }
  ];

  await Listing.insertMany(listings);
  console.log("🌱 20 beautiful listings inserted");
};

main()
  .then(seedDB)
  .then(() => mongoose.connection.close())
  .catch(err => console.error(err));
