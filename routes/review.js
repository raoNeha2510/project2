const express= require("express");
const router=express.Router({mergeParams:true});
// to handle async error use wrapAsync
const wrapAsync=require("../utils/wrapAsync.js");
// to handle custom error and show statuscode
const ExpressError=require("../utils/expressError.js");
//require review model
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");

//  post Review Route

router.post("/",
  isLoggedIn,
   validateReview,
   wrapAsync(reviewController.createReview)
);

// Delete review Route
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);
module.exports=router;