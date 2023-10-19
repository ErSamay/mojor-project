const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrap.js");
const ExpressError = require("./utils/ExpressError.js")
const { wrap } = require("module");
const {listingSchema , reviewSchema} = require("./schema.js");
const { title } = require("process");

const listingRouter = require("./router/listing.js")
const reviewRouter = require("./router/review.js")
const userRouter = require("./router/user.js")
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy  = require("passport-local");


const User = require("./models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));

const sessionOptions = {
  secret : "mysupersecretstring" , 
  resave : false , 
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000 , 
    httpOnly : true,
  }
}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req , res , next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  
  console.log(res.locals.success)
  next();

} )
// app.get("/demouser" , async(req , res) => {
//   let fakeuser = new User({

//     email : "Samay55@", 
//     username : "Delta-student",

//   });
//   let registerUser = await User.register(fakeuser , "helloworld");
//   res.send(registerUser);
// })

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
//   if(error){
//     throw new ExpressError(400 , result.error)
//   }
//   else{
//     next();
//   }
// });

// const validateListing = (req , res , next ) => {
//   let {error} = listingSchema.validate(req.body);

//   if(error){
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400 , result.error)
//   }
//   else{
//     next();
//   }
// }

// const validateReview = (req , res , next ) => {
//   let {error} = reviewSchema.validate(req.body);

//   if(error){
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400 , result.error)
//   }
//   else{
//     next();
//   }
// }

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);

// //Index Route
// app.get("/listings",wrapAsync (async (req, res ,next) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// }));

// //New Route
// app.get("/listings/new", (req, res) => {
//   res.render("listings/new.ejs");
// });



// //Show Route
// app.get("/listings/:id",wrapAsync( async (req, res , next) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id).populate("reviews");
//   res.render("listings/show.ejs", { listing });
// }));

// //Create Route
// app.post("/listings", validateListing ,wrapAsync (
//    async (req, res , next) => {
//   const newListing = new Listing(req.body.listing);
//   await newListing.save();
//   res.redirect("/listings");

// }))
// app.get("/listings/:id/edit" , wrapAsync(async(req , res , next) => {
//     let{id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing });
    
// }))

// //Edit Route
// // app.get("/listings/:id/edit", async (req, res) => {
// //   let { id } = req.params;
// //   const listing = await Listing.findById(id);
// //   res.render("listings/edit.ejs", { listing });
// // });

// // //Update Route
// app.put("/listings/:id",  (req, res , next) => {
//   let { id } = req.params;
// Listing.findByIdAndUpdate(id, { ...req.body.listing }).then((res) => {
//   console.log(res)
// })
// .catch((err) => {
//   console.log(err)
// })
//   res.redirect(`/listings/${id}`);
// })

// // //Delete Route
// app.delete("/listings/:id",wrapAsync (async (req, res , next) => {

//   let { id } = req.params;
//   let deletedListing = await Listing.findByIdAndDelete(id);
//   console.log(deletedListing);
//   res.redirect("/listings");
// }))

// app.post("/listings/:id/reviews" ,validateReview ,wrapAsync(  async(req , res) => {
//   // let{id} = req.params;
//  let listing =  await Listing.findById(req.params.id);
//  let newReview = new Review(req.body.review)
// listing.reviews.push(newReview);
// await newReview.save();
// await listing.save();

// res.redirect(`/listings/${listing._id}`)

// }))

// app.delete("/listings/:id/reviews/:reviewId" , wrapAsync(async(req , res) => {
// let {id , reviewId} = req.params;
// await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}})
//  await Review.findByIdAndDelete(reviewId);
//  res.redirect(`/listings/${id}`)
// })  )


// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });
app.all("*" , (req ,res , next) => {
  next(new ExpressError(404 , "Error Encountered"))
})


app.use((err , req ,res , next) => {
  let {status = 500 , message = "wrong❌"} = err;
  res.render("error.ejs" , {message})
})

app.listen(3000, () => {
  console.log("server is listening to port 8080");
});