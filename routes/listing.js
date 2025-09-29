const express= require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
//require loggdin middleware
const{isLoggedIn, isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controllers/listing.js");
// use to parse form data for uploading images or file
const multer = require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage:storage});// multer bydeafalt store files in cloudinary storage



router
.route("/")
.get( wrapAsync(listingController.index))
.post(
 isLoggedIn,
   validateListing,
 upload.single("listing[image]"),
//  validateListing,
   wrapAsync(listingController.createListing)
  
);



//New Route
router.get("/new", isLoggedIn, listingController.renderNewform);

router
.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
    validateListing,
  upload.single("listing[image]"),
  // validateListing,
  wrapAsync(listingController.UpdateListing)
)


.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

//Edit Route
router.get("/:id/edit", 
  isLoggedIn,
  isOwner,
   wrapAsync(listingController.renderEditForm)
);
//  Category filter route
router.get("/", wrapAsync(listingController.index)

);
router.get("/category/:category", wrapAsync(listingController.categoryListings));



module.exports=router;