const { Campground } = require("../models/camp.js");

module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({}).populate("user");
  res.render("campground/allCampground.ejs", { campgrounds });
  console.log(res.locals.user);
};

module.exports.new = (req, res) => {
  res.render("campground/new.ejs");
};

module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campground/edit.ejs", { campground });
};

module.exports.show = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "user",
      },
    })
    .populate("user");
  if (campground && campground.id == id) {
    return res.render("campground/show.ejs", { campground });
  }
  req.flash("error", "Cannot find that campground");
  res.redirect("/campground");
};

module.exports.postNewCampground = async (req, res) => {
  const user = req.user.id;
  const { title, location, price, description, image } = req.body;
  const campground = new Campground({ title, location, price, description, image, user });
  await campground.save();
  req.flash("success", "Sukses Membuat Camground Baru!!!");
  res.redirect("/campground");
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const { title, location, price, description, image } = req.body;
  await Campground.findByIdAndUpdate(id, { title, location, price, description, image });
  req.flash("success", "Campground Berhasil diubah!!!");
  res.redirect("/campground");
};


module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Berhasil menghapus campground!!!");
  res.redirect("/campground");
};