const express = require("express");
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrap.js");
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema , reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const { isLoggedIn , isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js")




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
const validateReview = (req , res , next ) => {
    let {error} = reviewSchema.validate(req.body);
  
    if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400 , result.error)
    }
    else{
      next();
    }
  }

router.post("/" ,isLoggedIn,validateReview ,wrapAsync(reviewController.createReview))


  router.delete("/:reviewId",isLoggedIn , isReviewAuthor,wrapAsync(reviewController.deleteReview))
  

  module.exports = router;