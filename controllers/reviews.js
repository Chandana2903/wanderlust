const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/expresserror");

// CREATE REVIEW
module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    throw new ExpressError("Listing not found", 404);
  }

  const review = new Review(req.body.review);
  review.author = req.user._id;

  await review.save();

  listing.reviews.push(review);
  await listing.save();

  req.flash("success", "Review added successfully");
  res.redirect(`/listings/${listing._id}`);
};

// DELETE REVIEW (ONLY AUTHOR)
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted");
  res.redirect(`/listings/${id}`);
};
