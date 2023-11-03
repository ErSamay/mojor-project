if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

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
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy  = require("passport-local");

const User = require("./models/user.js");

const MONGO_URL = "mongodb+srv://user123:user123@delta.s8kvkvv.mongodb.net/?retryWrites=true&w=majority"

main()
  .then(() => {
    console.log("connection successfull");
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

const store = MongoStore.create({
  mongoUrl : MONGO_URL , 
  crypto :{
    secret : process.env.SECRET, 
  },
  touchAfter : 24 * 3600
})

store.on("error" , () => {
  console.log("Error in Mongo Store" , err);
});

const sessionOptions = {
  store : store , 
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
  res.locals.currUser = req.user;
  next();

} )

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);

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