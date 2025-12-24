const express = require("express");
const router = express.Router();
const Booking = require("../models/bookings");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

// =======================
// CREATE BOOKING
// =======================
router.post("/:listingId", isLoggedIn, async (req, res) => {
  try {
    const { listingId } = req.params;
    const { checkIn, checkOut } = req.body;

    if (!checkIn || !checkOut) {
      req.flash("error", "Please select both check-in and check-out dates.");
      return res.redirect(`/listings/${listingId}`);
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // ❌ Date check: end must be after start
    if (start >= end) {
      req.flash("error", "Check-out date must be after check-in date.");
      return res.redirect(`/listings/${listingId}`);
    }

    // 🔥 CHECK FOR OVERLAPPING BOOKINGS FOR SAME USER
    const conflict = await Booking.findOne({
      user: req.user._id,
      $or: [
        { checkIn: { $lte: end }, checkOut: { $gte: start } } // ANY overlap
      ]
    }).populate("listing");

    if (conflict) {
      req.flash(
        "error",
        `You already have a booking from ${conflict.checkIn.toDateString()} to ${conflict.checkOut.toDateString()}
         for "${conflict.listing.title}". You can't book another stay on these dates.`
      );
      return res.redirect(`/listings/${listingId}`);
    }

    // 🔥 CREATE BOOKING
    await Booking.create({
      listing: listingId,
      user: req.user._id,
      checkIn: start,
      checkOut: end,
    });

    req.flash("success", "Booking confirmed 🎉");
    res.redirect("/dashboard");
  } catch (err) {
    console.log("Booking error:", err);
    req.flash("error", "Something went wrong while booking.");
    res.redirect("back");
  }
});

// =======================
// DELETE BOOKING
// =======================
router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/dashboard");
    }

    // Security check → user can delete ONLY their own booking
    if (!booking.user.equals(req.user._id)) {
      req.flash("error", "Unauthorized action.");
      return res.redirect("/dashboard");
    }

    await Booking.findByIdAndDelete(id);

    req.flash("success", "Booking cancelled.");
    res.redirect("/dashboard");

  } catch (err) {
    console.log("Delete Booking Error:", err);
    req.flash("error", "Error cancelling booking.");
    res.redirect("/dashboard");
  }
});

module.exports = router;
