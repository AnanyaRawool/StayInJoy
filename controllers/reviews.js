const Listing = require("../models/listing");
const Review = require("../models/review"); 

module.exports.createReview = async (req, res) => { //pass a validate review as middleware
    const { listingId } = req.params;
    let listing = await Listing.findById(listingId);
    let newReview = new Review(req.body.review);//created review stored in new review
    newReview.author = req.user._id; //review should have associated author 
    console.log(newReview);
    listing.reviews.push(newReview);//push new review in the array of reviews array
    
    await newReview.save();
    await listing.save();
  
    console.log("new review saved");
    req.flash("success","New Review Created");
    res.redirect(`/listings/${listing._id}`);
  
   }

   module.exports.destroyReview = async(req, res) =>{
      let { listingId, reviewId } = req.params; 
      await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId }}); 
      await Review.findByIdAndDelete(reviewId); 
      req.flash("success","Review Deleted!");
      res.redirect(`/listings/${listingId}`);
  }

