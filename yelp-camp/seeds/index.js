const mongoose = require("mongoose");
const { Campground } = require("../models/camp.js");
const { User } = require('../models/user.js');
const cities = require("./cities.js");
const { descriptors, places } = require("./seedHelpers.js");
const userSeeds = require('./user.js')

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const userRandomize = async (seed) => {
  for(let i = 1 ; i <=  20 ; i++){
  const userData = seed[i];
  const {password,username,email} = userData;
  const userModel = new User({username,email});
  const user = await User.register(userModel,password)
  console.log(user);
  }
}


const makeCampground = async () => {
  const random = (e) => {
    return Math.floor(Math.random() * e.length) + 1;
  };
  for (let i = 1; i <= 20; i++) {
    const userData = await User.find();
    const user= userData[random(userData)].id;
    const number = random(cities);
    const location = `${cities[number].city},${cities[number].state}`;
    const title = `${descriptors[random(descriptors)]} ${places[random(places)]}`;
    const images = [
  {
    url: 'https://res.cloudinary.com/dsme2ifqy/image/upload/v1692226873/Yelp-camp/cydecrfoseonnnbvsddf.jpg',
    filename: 'Yelp-camp/cydecrfoseonnnbvsddf'
  },
  {
    url: 'https://res.cloudinary.com/dsme2ifqy/image/upload/v1692226873/Yelp-camp/ldlhxws6uhubrh2itx9c.jpg',
    filename: 'Yelp-camp/ldlhxws6uhubrh2itx9c'
  },
  {
    url: 'https://res.cloudinary.com/dsme2ifqy/image/upload/v1692226873/Yelp-camp/n1x3lgusmricuzguofgn.jpg',
    filename: 'Yelp-camp/n1x3lgusmricuzguofgn'
  }
];
    const price = Math.round((Math.random())*100);
    const description = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus repellendus natus laudantium tenetur fugiat cupiditate, et quod dolore perspiciatis nulla praesentium optio impedit ex doloribus rerum, libero consectetur distinctio qui?";
    const campground = new Campground({location,title,images,price,description,user});
    await campground.save(); 
  }
};


