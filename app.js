// app.js

require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
// const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// Routers
const listingRouter = require("./routes/listings");
const reviewRouter = require("./routes/reviews");
const userRouter = require("./routes/user");
const wishlistRouter = require("./routes/wishlist");
const dashboardRouter = require("./routes/dashboard");
const travelRouter = require("./routes/travel");
const bookingRouter = require("./routes/bookings");

// ---------------- ENV ----------------
const dbUrl = process.env.MONGO_URI;

// ---------------- MONGOOSE ----------------
mongoose
  .connect(dbUrl, {
    dbName: "wanderlust",
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// ---------------- VIEW ENGINE ----------------
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---------------- MIDDLEWARE ----------------
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ---------------- SESSION STORE ----------------
// ---------------- SESSION ----------------
// ---------------- SESSION ----------------
const MongoStore = require("connect-mongo").default;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (e) => {
  console.log("SESSION STORE ERROR:", e);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 3,
  },
};

app.use(session(sessionOptions));
app.use(flash());



// ---------------- PASSPORT ----------------
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ---------------- LOCALS ----------------
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ---------------- HOME ----------------
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// ---------------- ROUTES ----------------
app.use("/users", userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/wishlist", wishlistRouter);
app.use("/dashboard", dashboardRouter);
app.use("/travel", travelRouter);
app.use("/bookings", bookingRouter);

// ---------------- 404 HANDLER ----------------
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});


// ---------------- ERROR HANDLER ----------------
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});

// ---------------- SERVER ----------------
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
