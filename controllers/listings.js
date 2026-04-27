const Listing = require("../models/listing");

// map use
const axios = require("axios");

// updated index to support category filter
module.exports.index = async(req, res) => {
    let { category } = req.query;
    let allListings;

    if(category){
        allListings = await Listing.find({ category: category });
    } else {
        allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings, category });
};

module.exports.renderNewForm = (req, res) =>{
    res.render("listings/new.ejs");
    }

module.exports.showListing = async(req,res) => {
      let {id} = req.params;
      const listing = await Listing.findById(id)
        .populate({
             path: "reviews", 
             populate:{
                 path: "author",
               },
             })
        .populate("owner");
      if(!listing){
         req.flash("error","Listing you requested for does not existed!");
         res.redirect("/listings");
       }
       console.log("GEOMETRY:", listing.geometry);  // ✅ add this line
      res.render("listings/show.ejs", {listing});
  }

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  
  const newListing = new Listing(req.body.listing);

  // geocoding
  try {
      const geoResponse = await axios.get(
          `https://nominatim.openstreetmap.org/search`, {
              params: {
                  q: `${req.body.listing.location}, ${req.body.listing.country}`,
                  format: "json",
                  limit: 1,
              },
              headers: {
                  "User-Agent": "WanderLust/1.0"
              }
          }
      );

      const geoData = geoResponse.data;
      console.log("GeoData received:", geoData); // ✅ check what comes back
      
      if(geoData.length > 0){
          newListing.geometry = {
              type: "Point",
              coordinates: [
                  parseFloat(geoData[0].lon),
                  parseFloat(geoData[0].lat),
              ]
          };
          console.log("Geometry set:", newListing.geometry); // ✅ verify
      } else {
          console.log("No geodata found for:", req.body.listing.location);
      }
  } catch(err) {
      console.log("Geocoding error:", err.message); // ✅ catch API errors
  }

  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res) =>{
    let {id} = req.params ; //extract id for editing
    const listing = await Listing.findById(id);//find element by id for editing
    if(!listing){
     req.flash("error","Listing you requested for does not existed!");
     res.redirect("/listings");
   }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl}); 
  }

  module.exports.updateListing = async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    const geoResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search`, {
            params: {
                q: `${req.body.listing.location}, ${req.body.listing.country}`,
                format: "json",
                limit: 1,
            },
            headers: {
                "User-Agent": "WanderLust/1.0"
            }
        }
    );

    const geoData = geoResponse.data;
    if(geoData.length > 0){
        listing.geometry = {       // ✅ listing not newListing
            type: "Point",
            coordinates: [
                parseFloat(geoData[0].lon),
                parseFloat(geoData[0].lat),
            ]
        };
    }

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    await listing.save();
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

  module.exports.destroyListing = async(req,res)=>{
    let{id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id); //as the findByIdAndDelete(id) is called then as a middleware post mongoose middleware from listing.js will run and then delete corresponding reviews
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}

// search listings
module.exports.searchListings = async(req, res) => {
    let { q } = req.query;  // get search query from URL
    
    if(!q || q.trim() === ""){
        req.flash("error", "Please enter something to search!");
        return res.redirect("/listings");
    }

    // search in title, description, location, country
    const allListings = await Listing.find({
        $or: [
            { title:       { $regex: q, $options: "i" } },  // i = case insensitive
            { description: { $regex: q, $options: "i" } },
            { location:    { $regex: q, $options: "i" } },
            { country:     { $regex: q, $options: "i" } },
        ]
    });

    if(allListings.length === 0){
        req.flash("error", `No results found for "${q}"`);
        return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { allListings });
};