const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { isLoggedIn } = require("../middleware");

// ❤️ TOGGLE WISHLIST
router.post("/:id", isLoggedIn, async (req, res) => {
  const user = await User.findById(req.user._id);
  const listingId = req.params.id;

  if (user.wishlist.includes(listingId)) {
    user.wishlist.pull(listingId);
  } else {
    user.wishlist.push(listingId);
  }

  await user.save();
  const redirectUrl = req.get("referer") || "/listings";
res.redirect(redirectUrl);

});

module.exports = router;
