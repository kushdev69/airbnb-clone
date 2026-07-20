const express = require("express");
const wrapAsync= require("../utils/wrapAsync.js");
const listingmodel = require("../models/listings.js");  //listing model mongoose schema
const reviewmodel = require("../models/reviews.js");  //reviews model mongoose schema
const { isReviewOwner, validateReviews, isLoggedIn}= require("../middleware.js")


const router= express.Router( {mergeParams:true} );


router.post("/",isLoggedIn ,validateReviews, wrapAsync( async (req, res) => {
  let {id}= req.params;
  let listing = await listingmodel.findById(id);    
  let review = new reviewmodel(req.body.review);
  review.author= req.user._id;
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  req.flash("success", "review was added successfully");
  res.redirect(`/listings/${listing._id}`);
}));


//delete reviews
router.delete("/:re_id" ,isReviewOwner ,wrapAsync( async(req, res )=>{
  let {id, re_id}= req.params;
  let removefromlisting =await listingmodel.findByIdAndUpdate(id,{$pull:{reviews:re_id}});
  let deletedreivew = await reviewmodel.findByIdAndDelete(re_id); 
  req.flash("error", "review deleted");
  res.redirect(`/listings/${id}`);
  
}));


module.exports= router;
