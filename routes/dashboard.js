const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const TravelPlan = require("../models/travelPlan");
const Booking = require("../models/bookings");

const { isLoggedIn } = require("../middleware");

router.get("/", isLoggedIn, async (req, res) => {
  // 🏠 Listings owned by user
  const myListings = await Listing.find({ owner: req.user._id });

  // ✈️ Travel wishlist
  const plans = await TravelPlan.find({ user: req.user._id });

  // 🏨 Bookings by user
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing");

  // ❤️ Wishlist listings
  const wishlist = await Listing.find({
    _id: { $in: req.user.wishlist }
  });

  res.render("dashboard/index", {
    myListings,
    plans,
    bookings,
    wishlist
  });
});

module.exports = router;
