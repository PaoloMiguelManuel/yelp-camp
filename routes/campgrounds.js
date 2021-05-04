const express = require('express');
const router = express.Router();
const campgroundsController = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

// dont need to specify cloudinary/index.js because node automatically lookds for an index.js file
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });




const Campground = require('../models/campground');

router.route('/')
   .get(catchAsync(campgroundsController.index))
   .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgroundsController.createCampground));


// create new campground route (this is just the page for the USER FORM)
router.get('/new', isLoggedIn, campgroundsController.renderNewForm);

router.route('/:id')
   .get(catchAsync(campgroundsController.showCampground))
   .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgroundsController.updateCampground))
   .delete(isLoggedIn, isAuthor, catchAsync(campgroundsController.deleteCampground));



// the actual POSt request to create a new campground

// show details for one campground route

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundsController.renderEditForm));




module.exports = router;