const mongoose = require("mongoose");

// creating schema for model creation 
const Schema = mongoose.Schema; 

const reviewSchema = new Schema ({
    comment : String,//comments are inthe form of strings
    rating : { //rating is inthe form of number between 1 to 5
        type: Number,
        min:1,
        max: 5
    },
    createdAt:{ // post created at date mentioning part , if date not mention then current date is considered
        type: Date,
        default: Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

module.exports = mongoose.model("Review", reviewSchema); //creating review model
