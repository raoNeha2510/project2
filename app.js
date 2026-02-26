if(process.env.NODE_ENV !="production"){
require('dotenv').config();
}




const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path = require("path");
const methodOverride=require("method-override");
// for templating
const ejsMate =require ("ejs-mate");
// to handle custom error and show statuscode
const ExpressError=require("./utils/expressError.js");
// require listings routes
const listingsRouter= require("./routes/listing.js");
// require reviwes
const reviewsRouter=require("./routes/review.js");
// require user.js
const userRouter=require("./routes/user.js");
//  require  bookings.js 
const bookingRoutes = require("./routes/bookings");
const session= require("express-session");
//require connectMongo
const MongoStore=require("connect-mongo");
// require connect-flash
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

// const MANGO_URL="mangodb://127.0.0.1:27017/wanderlust";
const dbUrl =process.env.ATLASDB_URL;


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect( dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// mongoStore is created here
const store=MongoStore.create({
  mongoUrl: dbUrl,   //sssoion information saved in MongoAtlas db
  
  crypto:{
    secret:process.env.SECRET,
   },
   touchAfter:24 * 3600,
});

store.on("error",()=>{
  console.log(("ERROR in MONGO SESSION STORE",err));

});

// session option is defined
const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge:+7 * 24 * 60 * 1000,
    httpOnly:true,  // secure and preventing from scripting attacks
  },
};


// app.get("/",(req,res)=>{
//     res.send("Hi, I am root");
// });

app.use(session(sessionOptions));
// use flash
app.use(flash());

// local passport implenetation
app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware to flash message when newlisting is created
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;


  next();
});


// for listing route
app.use("/listings",listingsRouter);
// for review routes
app.use("/listings/:id/reviews",reviewsRouter)
// FOR user router
app.use("/",userRouter);
app.use("/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.redirect("/listings");
});

 app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});



app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs",{message});
});



app.listen(3000,()=>{
    console.log("server is listing port 3000");
});