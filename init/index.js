require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// CONNECT TO ATLAS
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

    // 👉 REPLACE WITH REAL USER ID FROM ATLAS
    const ownerId = new mongoose.Types.ObjectId("694a443768afa3de43e70c73");

    const listingsWithOwner = initData.data.map((obj) => ({
      ...obj,
      category: obj.category || "Rooms",   // ✔ ensure category exists
      owner: ownerId,
      geometry: {
        type: "Point",
        coordinates: [0, 0],
      },
    }));

    await Listing.insertMany(listingsWithOwner);
    console.log("🌱 Sample listings added successfully!");
  } catch (err) {
    console.log("Error seeding database:", err);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

initDB();
