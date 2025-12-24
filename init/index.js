require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const geocode = require("../utils/geocode");

const MONGO_URL = process.env.MONGO_URI;

main()
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log("DB Connection Error:", err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    console.log("Clearing old listings...");
    await Listing.deleteMany({});

    const listings = [];

    for (let obj of initData.data) {
      let geo = { lat: 0, lng: 0 };

      try {
        geo = await geocode(obj.location);
      } catch (err) {
        console.log("⚠️ Geocode failed for:", obj.location);
      }

      listings.push({
        ...obj,
        owner: new mongoose.Types.ObjectId("676d7c7870d7a785af3ec5aa"), // your admin user id
        geometry: {
          type: "Point",
          coordinates: [geo.lng, geo.lat],
        },
      });
    }

    await Listing.insertMany(listings);
    console.log("🌱 All sample listings seeded with real coordinates!");
  } catch (err) {
    console.log("Error seeding database:", err);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

initDB();
