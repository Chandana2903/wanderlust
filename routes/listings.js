const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema");
const { isLoggedIn } = require("../middleware");

const listingController = require("../controllers/listings");

// multer + cloudinary
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

// ---------------- JOI VALIDATION ----------------
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  }
  next();
};

// ---------------- ROUTES ----------------

// INDEX
router.get("/", wrapAsync(listingController.index));

// NEW
router.get("/new", isLoggedIn, listingController.renderNewForm);

// CREATE ✅ (FINAL FIX)
router.post(
  "/",
  isLoggedIn,
  upload.single("image"),
  validateListing,
  wrapAsync(listingController.create)
);

// SHOW
router.get("/:id", wrapAsync(listingController.showListing));

// EDIT
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.edit));

// UPDATE
router.put(
  "/:id",
  isLoggedIn,
  upload.single("image"),   // ✅ allow optional image
  validateListing,
  wrapAsync(listingController.update)
);


// DELETE
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(listingController.delete)
);

module.exports = router;
