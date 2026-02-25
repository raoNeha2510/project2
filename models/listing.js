// model/listing.js
const mongoose=require("mongoose");
const review = require("./review");
const Schema=mongoose.Schema;
const Review=require("./review.js");


    const listingSchema = new Schema({
  title: {
    type: String,
    require :true
    
  },
  description: String,
  image: {
    url:String,
    filename:String,
    
   
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    },
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
   category: {
    type: String,
    enum: [
      "Trending",
      "Room",
      "Iconic Cities",
      "Mountains",
      "Castles",
      "Amazing Pool",
      "Camping",
      "Farms",
      "Arctic",
      "Domes",
      "Boats",
    ],
    required: true,
  },
  geometry:{
    type:{
      type:String,
      enum:['Point'],
      required:true
    },
    coordinates:{
      type:[Number],
      required:true
    }
  }
 
});
// post mongoose middleware  it triggerd when any listing call findOneAndDete 
// and delete all corresponding reviews of that listing from the database
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
  await Review.deleteMany({_id: {$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

