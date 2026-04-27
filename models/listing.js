const mongoose = require("mongoose");
const Review = require("./review.js");
const { types } = require("joi");
// creating schema for model creation 
const Schema = mongoose.Schema; 
const listingSchema = new Schema ({
     title :{
        type:String,
        required:true,
     },
     description:String,
     image: {
     url:String,
     filename: String
    },
    
     price:Number,
     location:String,
     country:String,

     // add taxRate here
     taxRate:{
        type:Number,
        default: 18    // default 18% GST
     },

     //  map use
     geometry: {
      type: {
          type: String,
          enum: ["Point"],
          required: false
      },
      coordinates: {
          type: [Number],
          required: true
      }
  },

     reviews:[
      {
         type: Schema.Types.ObjectId, //all review of particular hotel having id and that id is save in the array 
         ref: "Review",
      },
     ],
     owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
     },

     category:{
        type: String,
        enum: ["trending", "rooms", "iconic cities", "mountains", "castles", "amazing pools", "camping", "farms", "arctic", "domes", "boats"],
        default: "trending"
    }
});


//as we delete listing(a card of villa or place) its review should get deleted so we create post mongoose middleware
  listingSchema.post("findOneAndDelete", async(listing) =>{ //post will work on findOneAndDelete and for this async middleware we defined which consist of listing data which will get deleted 
  if(listing){// this opration will perform only when there is any listing come
   await Review.deleteMany({_id : {$in: listing.reviews}}); //id's inside the listing.reviews make list of them and these id's is a part of '_id' then id of that review completely deleted 
  }
});



//creating model 
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
