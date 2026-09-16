const listingmodel = require("../models/listings.js");  //listing model mongoose schema
const reviewmodel = require("../models/reviews.js");  //reviews model mongoose schema

module.exports.createReview =async (req, res) => {
  let {id}= req.params;
  let listing = await listingmodel.findById(id);    
  let review = new reviewmodel(req.body.review);
  review.author= req.user._id;
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  res.status(201).json(review);
};

module.exports.deleteReview = async(req, res )=>{
  let {id, re_id}= req.params;
  await listingmodel.findByIdAndUpdate(id,{$pull:{reviews:re_id}});
  await reviewmodel.findByIdAndDelete(re_id); 
  res.json({ message: "Review deleted successfully" });
  
};