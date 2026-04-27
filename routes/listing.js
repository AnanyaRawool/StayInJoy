const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js"); 
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


// search route 
router.get("/search", wrapAsync(listingController.searchListings));

// all the path with "/" consider at same place and so no deed to write again and again "/" 
router
  .route("/")   
  .get(wrapAsync(listingController.index)) //index route for return all data when request is come on listing
  .post( //create route for , information given by user for creating new list , use to create new list  (create route)
    isLoggedIn,
    upload.single('listing[image]'),
    wrapAsync(listingController.createListing)
  );
  

//new route for add new list (new route)
router.get("/new" ,isLoggedIn, listingController.renderNewForm); 

  router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))  //show all data of specific item by using id (showroute)
  .put( //update route make the chnages in the older data to new data given by user (update route)
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.updateListing)
    )
    .delete( //delete route
      isLoggedIn, 
      isOwner,
      wrapAsync(listingController.destroyListing)
 );

   //edit route for edit created list(edit route)
   router.get(
    "/:id/edit",
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.renderEditForm)
  );
   
   module.exports = router;