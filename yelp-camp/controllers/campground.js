const { Campground } = require("../models/camp.js");
const cloudinary = require("cloudinary").v2;
module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({}).populate("user");
  res.render("campground/allCampground.ejs", { campgrounds });
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
  const images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  const { title, location, price, description } = req.body;
  const campground = new Campground({ title, location, price, description, images, user });
  await campground.save();
  req.flash("success", "Sukses Membuat Camground Baru!!!");
  res.redirect(`/campground/${campground.id}`);
};

module.exports.updateCampground = async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  const camp = await Campground.findById(id);
  const { title, location, price, description, deleteImages } = req.body;
  const uploadedImages = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  camp.images.push(...uploadedImages);
  if (deleteImages) {
    for (let filename of deleteImages) {
      cloudinary.api.delete_resources(`${filename}`);
    }
    await Campground.findByIdAndUpdate(id, { title, location, price, description, $pull: { images: { filename: { $in: deleteImages } } } });
  } else {
    await Campground.findByIdAndUpdate(id, { title, location, price, description, images: camp.images });
  }

  req.flash("success", "Campground Berhasil diubah!!!");
  res.redirect(`/campground/${id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const { images } = await Campground.findByIdAndDelete(id);
  if (images.length <= 1) {
    for (let image of images) {
      cloudinary.api.delete_resources(`${image.filename}`).then((result) => console.log(result));
    }
  }

  req.flash("success", "Berhasil menghapus campground!!!");
  res.redirect("/campground");
};
