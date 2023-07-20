const mongoose = require("mongoose");
const { Campground } = require("../models/camp.js");
const cities = require("./cities.js");
const { descriptors, places } = require("./seedHelpers.js");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const makeCampground = async () => {
  const random = (e) => {
    return Math.floor(Math.random() * e.length) + 1;
  };
  for (let i = 1; i <= 20; i++) {
    const number = random(cities);
    const location = `${cities[number].city},${cities[number].state}`;
    const title = `${descriptors[random(descriptors)]} ${places[random(places)]}`;
    const campground = new Campground({location,title});
    await campground.save(); 
  }
  
};

const pushDescAndPic = async () => {
  const campgrounds = await Campground.find({});
  for(let campground of campgrounds){
  campground.price = 5;
  await campground.save();

  }
}




