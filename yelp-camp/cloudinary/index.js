const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: (req, file) => "Yelp-camp",
    allowed_formats: ["png", "jpg", "jpeg"],
  },
});

module.exports = { cloudinary, storage };
