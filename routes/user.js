const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/users");
const { saveRedirectUrl } = require("../middleware");

// SIGNUP
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(userController.signup);

// LOGIN
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/users/login",
      failureFlash: true,
    }),
    userController.login
  );

// LOGOUT
router.get("/logout", userController.logout);

module.exports = router;
