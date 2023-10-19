const express = require("express");
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrap.js");
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema , reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");




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

router.post("/" ,validateReview ,wrapAsync(  async(req , res) => {
  // let{id} = req.params;
 let listing =  await Listing.findById(req.params.id);
 let newReview = new Review(req.body.review)
listing.reviews.push(newReview);
await newReview.save();
await listing.save();
req.flash("success" , "review created")

res.redirect(`/listings/${listing._id}`)

}))
  router.delete("/:reviewId" , wrapAsync(async(req , res) => {
  let {id , reviewId} = req.params;

  await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}})

   await Review.findByIdAndDelete(reviewId);
   req.flash("success" , "review Deleted")
   res.redirect(`/listings/${id}`)
   }))
  

  module.exports = router;