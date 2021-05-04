const mongoose = require('mongoose');
const cities = require('./cities');
// const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');


if (process.env.NODE_ENV !== 'production') {
   require('dotenv').config();
}

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';


mongoose.connect(dbUrl, {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
   console.log("database connected");
});

const seedDB = async () => {
   await Campground.deleteMany({});
   for (let i = 0; i < 300; i++) {
      const random1000 = Math.floor(Math.random() * 1000);
      const price = Math.floor(Math.random() * 20) + 10;
      const camp = new Campground({
         // my user ID
         author: '60918a5de1801246bc68866b',
         location: `${cities[random1000].city}, ${cities[random1000].state}`,
         title: `${sample(descriptors)} ${sample(places)}`,
         image: 'https://source.unsplash.com/collection/483251',
         description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quisquam molestias ratione, totam assumenda delectus soluta libero doloribus repellat eos suscipit repellendus unde quae earum voluptates, cupiditate, commodi officiis at. Voluptate?',
         // writing price is shorthand since we're declaring a price variable up top
         price,
         geometry: {
            type: "Point",
            coordinates: [
               cities[random1000].longitude,
               cities[random1000].latitude
            ]
         },
         images: [
            {
               url: 'https://res.cloudinary.com/dfdezx7vz/image/upload/v1620150573/YelpCamp/is29yeqvk2awtcbxtky2.jpg',
               filename: 'YelpCamp/is29yeqvk2awtcbxtky2'
            },
            {
               url: 'https://res.cloudinary.com/dfdezx7vz/image/upload/v1620150573/YelpCamp/nrpt316rwd8tdfnjmjkc.jpg',
               filename: 'YelpCamp/nrpt316rwd8tdfnjmjkc'
            }
         ]
      });
      await camp.save();
   }
}

seedDB().then(() => {
   mongoose.connection.close();
});