const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const path = require("path");

const wrapAsync = require("../utils/wrap.js");
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema , reviewSchema} = require("../schema.js");

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


//Index Route
router.get("/",wrapAsync (async (req, res ,next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings }); 
  }));
  
  //New Route
  router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  
  
  

  router.get("/:id",wrapAsync( async (req, res , next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error" , "Listing you requested for does not exist")
      res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
  }));
  

router.post("/",
   async (req, res , next) => {
 
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success" , "new Listing Created");

  res.redirect("/listings");

})
router.get("/:id/edit" , wrapAsync(async(req , res , next) => {
    let{id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error" , "Listing you requested for does not exist")
      res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing });
    
}))

// Edit Route
router.get("/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});



router.put("/:id", async (req, res , next) => {
    let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing })
  req.flash("success" , "Listing Updated")
    res.redirect(`/listings/${id}`);
  })


router.delete("/:id",wrapAsync (async (req, res , next) => {

  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success" , "Listing Deleted")
  res.redirect("/listings");
}))

module.exports = router; 