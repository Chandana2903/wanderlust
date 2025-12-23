const express = require("express");
const router = express.Router();
const TravelPlan = require("../models/travelPlan");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

// SHOW TRAVEL LIST
router.get("/", isLoggedIn, async (req, res) => {
  const plans = await TravelPlan.find({ user: req.user._id });
  res.render("travel/index", { plans });
});

// ADD DESTINATION
router.post("/", isLoggedIn, async (req, res) => {
  const { location } = req.body;

  await TravelPlan.create({
    user: req.user._id,
    location,
  });

  res.redirect("/travel");
});

// RECOMMEND STAYS
router.get("/:id/recommendations", isLoggedIn, async (req, res) => {
  const plan = await TravelPlan.findById(req.params.id);

  const listings = await Listing.find({
    location: { $regex: plan.location, $options: "i" },
  });

  res.render("travel/recommendations", {
    plan,
    listings,
  });
});

module.exports = router;
