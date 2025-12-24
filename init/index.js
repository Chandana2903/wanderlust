require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const geocode = require("../utils/geocode");

const MONGO_URL = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.log("DB Connection Error:", err);
  }
}

const initDB = async () => {
  await connectDB();

  try {
    console.log("Clearing old listings...");
    await Listing.deleteMany({});

    const adminOwner = new mongoose.Types.ObjectId("676d7c7870d7a785af3ec5aa");

    const listings = [];

    for (let obj of initData.data) {
      let geo = { lat: 0, lng: 0 };

      try {
        geo = await geocode(obj.location);
      } catch (err) {
        console.log("⚠ Geocode failed for:", obj.location);
      }

      listings.push({
        ...obj,
        owner: adminOwner,
        geometry: {
          type: "Point",
          coordinates: [geo.lng, geo.lat]
        }
      });
    }

    await Listing.insertMany(listings);
    console.log("🌱 Listings seeded successfully!");
  } catch (err) {
    console.log("Error seeding database:", err);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

initDB();
