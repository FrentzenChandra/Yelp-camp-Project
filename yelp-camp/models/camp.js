const mongoose = require('mongoose');
const {Schema} = mongoose;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const CampgroundSchema = new Schema({
    location:String, 
    title: String,
    image:String,
    price:Number,
    description:String,
});

const Campground = mongoose.model('Campground',CampgroundSchema);

module.exports = {Campground};