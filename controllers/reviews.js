const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
   const campground = await Campground.findById(req.params.id);
   const review = new Review(req.body.review);
   review.author = req.user._id;
   // "reviews" is a property inside our "CampgroundScehma" inside models/campground.js
   campground.reviews.push(review);
   await review.save();
   await campground.save();
   req.flash('success', 'Successfully created a new review!');
   res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
   const { id, reviewId } = req.params;
   // $pull is a mongo operator that deletes an item from an array
   // looking inside camppground and deleting the review id reference from it. 
   await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
   // deleting the review itself
   await Review.findByIdAndDelete(reviewId);
   // delete the review and redirect (refreshes the page) to the same page
   req.flash('success', 'Successfully deleted review!');
   res.redirect(`/campgrounds/${id}`);
}