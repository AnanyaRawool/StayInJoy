const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js"); //review model aquire
const Listing = require("../models/listing.js"); //aquire listing.js file 
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js");

//review
//post  review route
router.post(
    "/",
    isLoggedIn,
    validateReview ,
    wrapAsync(reviewController.createReview)
  );
  
  
  //review delete route 
  //only /:id mean listing id and other id's will have specfic name
  router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor, 
    wrapAsync(reviewController.destroyReview)
);

  module.exports = router;
  