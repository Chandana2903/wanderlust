const express = require("express");
const router = express.Router({ mergeParams: true });

const Review = require("../models/review");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { reviewSchema } = require("../schema");
const { isLoggedIn } = require("../middleware");
const ExpressError = require("../utils/ExpressError");

// JOI validation
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  }
  next();
};

// ================= CREATE REVIEW =================
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;       // ⭐ VERY IMPORTANT
    await review.save();

    listing.reviews.push(review);
    await listing.save();

    req.flash("success", "Review added!");
    res.redirect(`/listings/${listing._id}`);
  })
);

// ================= DELETE REVIEW =================
router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
