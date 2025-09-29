const cloudinary=require("cloudinary").v2;
const{ CloudinaryStorage}=require("multer-storage-cloudinary");
  
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Configure CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wandelust_DEV',  // Optional: Folder for uploaded files in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],  // Optional: Restrict allowed file types
  },
});



module.exports={
    cloudinary,storage
};