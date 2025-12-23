const Listing = require("../models/listing");
const User = require("../models/user");

module.exports.renderDashboard = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("wishlist");

  const myListings = await Listing.find({ owner: req.user._id });

  res.render("dashboard/index", {
    user,
    wishlist: user.wishlist,
    myListings
  });
};
