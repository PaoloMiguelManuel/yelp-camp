if (process.env.NODE_ENV !== 'production') {
   require('dotenv').config();
}

// console.log(process.env.SECRET);
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
// const { campgroundSchema, reviewSchema } = require('./schemas.js');
// const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

// const { join } = require('path');
// destructuring join??
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const MongoStore = require('connect-mongo');


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
// const 
const MongoDBStore = require('connect-mongo')(session);

// fsdfsdfasdasdasdasdadasdasd
//local
//qwdwqdqwdqwgdjhqwdgqwj ddqdgqwhdgwq ddgqjhdwqdqwd 
// 'mongodb://localhost:27017/yelp-camp'

const fafasfasf = 3434;

mongoose.connect(dbUrl, {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
   useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
   console.log("Mongo database connected from app.js");
});

// console.log(`this secret is ${process.env.SECRET}`);

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
   replaceWith: '_'
}));

const secret = process.env.SECRET || 'tempsecret';

const store = new MongoDBStore({
   url: dbUrl,
   secret,
   touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
   console.log("session store error", e)
})

const sessionConfig = {
   store: store,
   name: 'session',
   secret,
   resave: false,
   saveUninitialized: true,
   cookie: {
      // client side secuity, prevents users from usiong cross-scripting to see the cookie
      httpOnly: true,
      // secure: true,
      // milliseconds, sec, minutes, hours, days
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
   }
}
app.use(session(sessionConfig));
app.use(flash());






// app.use(helmet({ contentSecurityPolicy: false }));


app.use(helmet());


const scriptSrcUrls = [
   "https://stackpath.bootstrapcdn.com/",
   "https://api.tiles.mapbox.com/",
   "https://api.mapbox.com/",
   "https://kit.fontawesome.com/",
   "https://cdnjs.cloudflare.com/",
   "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
   "https://cdn.jsdelivr.net",
   "https://kit-free.fontawesome.com/",
   "https://stackpath.bootstrapcdn.com/",
   "https://api.mapbox.com/",
   "https://api.tiles.mapbox.com/",
   "https://fonts.googleapis.com/",
   "https://use.fontawesome.com/",
];
const connectSrcUrls = [
   "https://api.mapbox.com/",
   "https://a.tiles.mapbox.com/",
   "https://b.tiles.mapbox.com/",
   "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
   helmet.contentSecurityPolicy({
      directives: {
         defaultSrc: [],
         connectSrc: ["'self'", ...connectSrcUrls],
         scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
         styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
         workerSrc: ["'self'", "blob:"],
         objectSrc: [],
         imgSrc: [
            "'self'",
            "blob:",
            "data:",
            "https://res.cloudinary.com/dfdezx7vz/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
            "https://images.unsplash.com/",
         ],
         fontSrc: ["'self'", ...fontSrcUrls],
      },
   })
);



















app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
})

//test



app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
   res.render('home');
});

// view all campgrounds route

app.all('*', (req, res, next) => {
   // res.send("404 page!");
   next(new ExpressError('Page not found!', 404));

});

app.use((err, req, res, next) => {
   const { statusCode = 500 } = err;
   if (!err.message) {
      err.message = "oh no something went wrong!"
   }
   res.status(statusCode).render('error', { err })
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
   console.log(`Serving on port ${port}`);
})