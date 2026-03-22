//controllers/listings.js
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const { cloudinary } = require("../cloudConfig");
const geocode = require("../utils/geocode");

// ================= INDEX =================
module.exports.index = async (req, res) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    query.title = { $regex: `^${search}`, $options: "i" };
  }

  const alllistings = await Listing.find(query);

  res.render("listings/index", {
    alllistings,
    wishlist: req.user ? req.user.wishlist : []
  });
};

// ================= NEW FORM =================
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// ================= SHOW =================
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};

// ================= EDIT =================
module.exports.edit = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/edit", { listing });
};

// ================= CREATE =================
module.exports.create = async (req, res) => {
  if (!req.file) {
    throw new ExpressError("Image upload failed", 400);
  }

  const newListing = new Listing(req.body.listing);

  try {
    const geoData = await geocode(newListing.location);

    newListing.geometry = {
      type: "Point",
      coordinates: [geoData.lng, geoData.lat],
    };
  } catch (err) {
    req.flash("error", "Invalid location. Please provide a valid city name.");
    return res.redirect("/listings/new");
  }

  newListing.image = {
    url: req.file.path,
    filename: req.file.filename,
  };

  newListing.owner = req.user._id;
  await newListing.save();

  req.flash("success", "New listing created successfully");
  res.redirect(`/listings/${newListing._id}`);
};


// ================= UPDATE =================
module.exports.update = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    id,
    req.body.listing,
    { new: true, runValidators: true }
  );

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  // 🌍 RE-GEOCODE IF LOCATION UPDATED
  if (req.body.listing.location) {
  try {
    const geoData = await geocode(req.body.listing.location);

    listing.geometry = {
      type: "Point",
      coordinates: [geoData.lng, geoData.lat],
    };
  } catch (err) {
    req.flash("error", "Invalid updated location");
    return res.redirect(`/listings/${id}/edit`);
  }
}


  // 🔁 IMAGE UPDATE
  if (req.file) {
    if (listing.image?.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }

    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();

  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${id}`);
};

// ================= DELETE =================
module.exports.delete = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndDelete(id);
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  if (listing.image?.filename) {
    await cloudinary.uploader.destroy(listing.image.filename);
  }

  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};
