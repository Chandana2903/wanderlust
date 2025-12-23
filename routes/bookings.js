const express = require("express");
const router = express.Router();
const Booking = require("../models/bookings");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

// CREATE BOOKING
router.post("/:listingId", isLoggedIn, async (req, res) => {
  const { listingId } = req.params;
  const { checkIn, checkOut } = req.body;

  if (!checkIn || !checkOut) {
    req.flash("error", "Please select dates");
    return res.redirect(`/listings/${listingId}`);
  }

  await Booking.create({
    listing: listingId,
    user: req.user._id,
    checkIn,
    checkOut,
  });

  req.flash("success", "Booking confirmed 🎉");
  res.redirect("/dashboard");
});
router.delete("/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);

  // Security check
  if (!booking || !booking.user.equals(req.user._id)) {
    req.flash("error", "Unauthorized action");
    return res.redirect("/dashboard");
  }

  await Booking.findByIdAndDelete(id);

  req.flash("success", "Booking cancelled");
  res.redirect("/dashboard");
});

module.exports = router;
