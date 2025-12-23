const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review");

const listingSchema = new Schema({
  title: String,
  description: String,

  image: {
    filename: String,
    url: String,
  },

  price: Number,
  location: String,   // user-entered place
  country: String,

  // 🌍 GEOJSON (FOR MAP)
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [lng, lat]
    },
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
  type: String,
  enum: [
    "Rooms",
    "Iconic Cities",
    "Mountains",
    "Castles",
    "Amazing Pools",
    "Camping",
    "Farms",
    "Arctic",
    "Domes",
    "Boats"
  ],
  required: true,
},

});

// 🧹 Delete reviews when listing deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
