const express = require("express");
const expressError= require("../utils/expressError.js");
const wrapAsync= require("../utils/wrapAsync.js");
const { reviewSchema}= require("../schema.js"); //validation schema with joi
const listingmodel = require("../models/listings.js");  //listing model mongoose schema
const reviewmodel = require("../models/reviews.js");  //reviews model mongoose schema


const router= express.Router( {mergeParams:true} );


function validateReviews(req, res, next){
     const result= reviewSchema.validate(req.body);
     if(result.error){
       throw new expressError(400, result.error.details.map(el=>el.message).join(","));
    }else{
      next();
    }
   
}


router.post("/",validateReviews, wrapAsync( async (req, res) => {
  let {id}= req.params;
  let listing = await listingmodel.findById(id);    
  let review = new reviewmodel(req.body.review);
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
}));


//delete reviews
router.delete("/:re_id" ,wrapAsync( async(req, res )=>{
  let {id, re_id}= req.params;
  let removefromlisting =await listingmodel.findByIdAndUpdate(id,{$pull:{reviews:re_id}});
  let deletedreivew = await reviewmodel.findByIdAndDelete(re_id); 
  res.redirect(`/listings/${id}`);
  
}));


module.exports= router;
