const express = require("express");
const app = express();
const path = require("path");
const { Campground } = require("./models/camp.js");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes get
app.get("/", (req, res) => {
  res.send("Ini Home Yelp-Camp");
});

app.get("/campground", async (req, res) => {
  const campgrounds = await Campground.find({});
  console.log(campgrounds);
  res.render("campground/allCampground.ejs", { campgrounds });
});

app.get("/campground/new", (req, res) => {
  res.render("campground/new.ejs");
});

app.get("/campground/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  res.render("campground/edit.ejs", { campground });
});

app.get("/campground/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campground/show.ejs", { campground });
});

// Routes Post
app.post("/campground/new", async (req, res) => {
  const { title, location } = req.body;
  const campground = new Campground({ title, location });
  await campground.save();
  res.redirect("/campground");
});

app.post("/campground/:id/edit", async (req, res) => {
  const { id } = req.params;
  const { location, title } = req.body;
  await Campground.findByIdAndUpdate(id, { location, title });
  res.redirect("/campground");
});

app.listen("8080", (req, res) => {
  console.log("Listen in 8080");
});
