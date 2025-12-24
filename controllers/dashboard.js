const Listing = require("../models/listing");
const User = require("../models/user");
const Booking = require("../models/bookings");

module.exports.renderDashboard = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  const myListings = await Listing.find({ owner: req.user._id });

  // ⭐ Load bookings + populate listing so dashboard can access title
  const myBookings = await Booking.find({ user: req.user._id })
    .populate("listing");

  res.render("dashboard/index", {
    user,
    wishlist: user.wishlist,
    myListings,
    myBookings
  });
};
