const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review.js");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const CampgroundSchema = new Schema({
  location: String,
  title: String,
  images: [
    {
      url: String,
      filename: String,
    }
  ],
  price: Number,
  description: String,
  user : {
    type: Schema.Types.ObjectId,
    ref : 'User',
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async function (camp) {
  if(camp){
    await Review.deleteMany({_id :{$in: camp.reviews }});
  }
  
});

const Campground = mongoose.model("Campground", CampgroundSchema);


module.exports = { Campground };
