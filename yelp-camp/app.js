if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const { User } = require("./models/user");
const mongoose = require("mongoose");
const ExpressError = require("./utils & midleware/expressError.js");
const session = require("express-session");
const campgroundRoutes = require("./routers/campground.js");
const reviewRoutes = require("./routers/reviews.js");
const registerRoutes = require("./routers/register.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");


main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// ejs setup
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Method Override Setup
app.use(methodOverride("_method"));

// Body Parser Setup
app.use(bodyParser.urlencoded({ extended: true }));

// Session Setup
const sessionConfig = {
  secret: "thisisnotagoodsecret",
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash Setup dan data local lainnya
app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes From another file
app.use("/", registerRoutes);
app.use("/campground", campgroundRoutes);
app.use("/campground/:id/review", reviewRoutes);

// Routes get
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// Routes post

// Middleware Ini berlaku ke sebuah router yang tidak diketahui
app.all("*", (req, res) => {
  next(new ExpressError("Page Not Found", 404));
});

// Middleware ini berlaku pada saat terjadi suatu error
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Oh Boy there Something Wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen("8080", (req, res) => {
  console.log("Listen in 8080");
});
