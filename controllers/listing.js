const Listing=require("../models/listing");
// for mapbox
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// index route
module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

// for new route
module.exports.renderNewform=(req, res) => {
  res.render("./listings/new.ejs");
};
// for show route
module.exports.showListing=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({        // populate review with author in nested populate
    path:"reviews",    
    populate:{
      path:"author",
    },
  })

  .populate("owner");
  if(!listing){
     req.flash("error","Listing you requested for does not exits!");
     return res.redirect("/listings");
  }
  console.log(listing);
  res.render("./listings/show.ejs", { listing });
};

// create route or post route
module.exports.createListing=async (req, res ,next) => {
   let response=await geocodingClient
   .forwardGeocode({
    query:req.body.listing.location,
    limit:1 ,
   })
   .send();
   

  let url=req.file.path;
  let filename=req.file.filename;
 
  const newListing = new Listing(req.body.listing);
  console.log(req.user);
   newListing.owner=req.user._id;
   if(req.file){
   newListing.image={url,filename};
   
   newListing.geometry=response.body.features[0].geometry;
   let savedListng=await newListing.save();
   console.log(savedListng);

   }
  await newListing.save();
  req.flash("success","New Listing Created!");
  res.redirect("/listings");
   };

   //for edit form and route
module.exports.renderEditForm=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
   if(!listing){
     req.flash("error","Listing you requested for does not exits!");
     return res.redirect("/listings");
  }
 let originalImageUrl=listing.image.url;
 originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");


  res.render("./listings/edit.ejs", { listing ,originalImageUrl});
};

// for update listing
module.exports.UpdateListing=async (req, res) => {
  let { id } = req.params;
  let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if(typeof req.file!=="undefined"){
   let url=req.file.path;
  let filename=req.file.filename;
  listing.image={url,filename};
  await listing.save();
  }
   req.flash("success","Listing updated !");
  res.redirect(`/listings/${id}`);
};
// for delete listing or delete route

module.exports.destroyListing=async(req,res)=>{
    let{id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
     req.flash("success"," Listing deleted!");
    res.redirect("/listings");
};

// controllers/listing.js
// module.exports.index = async (req, res) => {
//      const { category } = req.params;
//   const listings = await Listing.find({category});
//   res.render("listings/index", { listings,category });
// };


// --------------------
// GET /listings
// --------------------
module.exports.index = async (req, res) => {
  const { q, category } = req.query;

  let query = {};

  //  Search only by country & location
  if (q) {
    query.$or = [
      { country: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } }
    ];
  }

  // Filter by category if present
  if (category) {
    query.category = category;
  }

  const listings = await Listing.find(query);
  res.render("listings/index", { listings, q, category });
};

// --------------------
// GET /listings/category/:category
// --------------------
module.exports.categoryListings = async (req, res) => {
  const { category } = req.params;
  const { q } = req.query;

  let query = { category };

  if (q) {
    query.$or = [
      { country: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } }
    ];
  }

  const listings = await Listing.find(query);
  res.render("listings/index", { listings, q, category });
};


