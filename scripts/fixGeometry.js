const mongoose = require("mongoose");
const Listing = require("../models/listing");
const geocode = require("../utils/geocode");

mongoose
  .connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const fixListings = async () => {
  const listings = await Listing.find({
    $or: [
      { geometry: { $exists: false } },
      { "geometry.coordinates": { $size: 0 } }
    ]
  });

  console.log(`Found ${listings.length} listings without coordinates`);

  for (let listing of listings) {
    try {
      if (!listing.location) continue;

      const geo = await geocode(listing.location);

      listing.geometry = {
        type: "Point",
        coordinates: [geo.lng, geo.lat]
      };

      await listing.save();
      console.log(`✅ Fixed: ${listing.title}`);
    } catch (err) {
      console.log(`❌ Failed: ${listing.title}`);
    }
  }

  mongoose.connection.close();
};

fixListings();
