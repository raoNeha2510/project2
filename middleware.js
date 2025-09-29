const Listing=require("./models/listing");
const Review=require("./models/review");
// to handle custom error and show statuscode
const ExpressError=require("./utils/expressError.js");
//require listing schema
const{listingSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
  
  if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","you must be logged in to create listing!");
    return res.redirect("/login");
    
  }
  next();

};

module.exports.saveRrdirectUrl=(req,res,next)=>{
  
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
   }
  next();

};

// middleware for authorisation of for delete and edit routes it is not allowed form to edit
module.exports.isOwner=async(req,res,next)=>{
   let { id } = req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser.id)){
      req.flash("error","You are not the owner of listing");
     return res.redirect( `/listings/${id}`);
  
    }
    next();


};

// validation of schema as midleware
module.exports.validateListing=(req,res,next)=>{
   let {error}=listingSchema.validate(req.body);
   
   if(error){
    // to extract diffrent proprtis and detail of  eeach erroe
    let errmsg=error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errmsg)
   }
   else{
    next();
   }

};

// validation of schema as midleware 
module.exports. validateReview=(req,res,next)=>{
   let {error}= reviewSchema.validate(req.body);
   
   if(error){
    // to extract diffrent proprties and detail of  each error
    let errmsg=error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errmsg)
   }
   else{
    next();
   }

};
// middleware for authorising of deleting review 
module.exports.isReviewAuthor=async(req,res,next)=>{
   let {id, reviewId } = req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser.id)){
      req.flash("error","You are not the auhtor of  this review");
     return res.redirect( `/listings/${id}`);
  
    }
    next();


};