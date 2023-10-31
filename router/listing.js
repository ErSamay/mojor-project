const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const path = require("path");
const wrapAsync = require("../utils/wrap.js");
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema , reviewSchema} = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const { storage} = require("../cloudConfig.js");
const upload = multer({ storage})

const validateListing = (req , res , next ) => {
    let {error} = listingSchema.validate(req.body);
  
    if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400 , result.error)
    }
    else{
      next();
    }
  }

router.route("/")
.get(wrapAsync (listingController.index))
.post(isLoggedIn , upload.single('listing[image]'),wrapAsync (listingController.postListing)
);


router.get("/new",isLoggedIn ,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing ))
.put(isLoggedIn ,isOwner ,upload.single('listing[image]'),
   wrapAsync (listingController.renderPostForm))
.delete(isLoggedIn ,isOwner , wrapAsync (listingController.destroyListing))

//Index Route

  
  //New Route
  router.get("/new",isLoggedIn ,listingController.renderNewForm);
  
  

  
  


router.get("/:id/edit" , isLoggedIn ,isOwner , wrapAsync(listingController.renderEditForm))

// Edit Route





module.exports = router; 