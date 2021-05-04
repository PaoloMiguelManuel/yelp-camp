const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
   // isAuthenticated is a built in middleware in passport
   if (!req.isAuthenticated()) {
      // below code is saving the page that we were on before being redirected/prompted to the login page
      // returnTo is just a variable we named being added to the current user's current session
      req.session.returnTo = req.originalUrl;
      req.flash('error', 'You must first be signed in');
      // must use return otherwirse res.render('campgrounds/new') will always run (still works but you will get errors)
      return res.redirect('/login');
   }
   next();
}

// middleware being used inside our post (new campground) route and our put route (edit campground)
module.exports.validateCampground = (req, res, next) => {
   //campgroundSchema.validate(req.body) returns an object which has a 'error' property
   // we are destructuring the error property so we can use it as is
   const { error } = campgroundSchema.validate(req.body);
   if (error) {
      // map over error.details to make a single string message separated by commas
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400);
   } else {
      next();
   }
}

module.exports.isAuthor = async (req, res, next) => {
   const { id } = req.params;
   const campground = await Campground.findById(id);
   if (!campground.author.equals(req.user._id)) {
      req.flash('error', 'Sorry, you do not have the permissions to do that!');
      return res.redirect(`/campgrounds/${id}`);
   }
   next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
   const { id, reviewId } = req.params;
   const review = await Review.findById(reviewId);
   if (!review.author.equals(req.user._id)) {
      req.flash('error', 'Sorry, you do not have the permissions to do that!');
      return res.redirect(`/campgrounds/${id}`);
   }
   next();
}

module.exports.validateReview = (req, res, next) => {
   const { error } = reviewSchema.validate(req.body);
   if (error) {
      // map over error.details to make a single string message separated by commas
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400);
   } else {
      next();
   }
}