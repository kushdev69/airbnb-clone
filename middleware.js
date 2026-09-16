let listing = require("./models/listings.js");
const review = require("./models/reviews.js");
const {listingSchema, reviewSchema}= require("./schema.joi.js"); //validation schema with joi
const expressError= require("./utils/expressError.js");


module.exports.isLoggedIn=(req, res ,next)=>{
    if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    // For API routes, return JSON error
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ message: "You must be logged in" });
    }
    req.flash("error", "you must be logged in !");
   return res.redirect('/users/login');
  }
  next();
}

module.exports.saveRedirectUrl=(req, res ,next)=>{
   if(req.session.redirectUrl){
    res.locals.redirectUrl= req.session.redirectUrl ; 
   } 
    next();
  };

  module.exports.isOwner= async(req, res ,next)=>{
     let {id}= req.params;
     let currlisting = await listing.findById(id);
    if(!(res.locals.currUser && currlisting.owner._id.equals(res.locals.currUser._id))){
      if (req.path.startsWith('/api/')) {
        return res.status(403).json({ message: "You don't have access to this operation" });
      }
      req.flash("error", "you dont have access to this operation ")
      return res.redirect("/listings");
   } 
    next();
  };

    module.exports.isReviewOwner= async(req, res ,next)=>{
     let {id ,re_id}= req.params;
     let currReview = await review.findById(re_id);
    if(!(res.locals.currUser && currReview.author.equals(res.locals.currUser._id))){
      if (req.path.startsWith('/api/')) {
        return res.status(403).json({ message: "You don't have access to this operation" });
      }
      req.flash("error", "you dont have access to this operation ")
      return res.redirect(`/listings/${id}`);
   } 
    next();
  };


 // joi validation middlewares for listing and review
  module.exports.validateListing= (req, res, next)=>{
       const result= listingSchema.validate(req.body);
       if(result.error){
         throw new expressError(400, result.error.details.map(el=>el.message).join(","));
      }else{
        next();
      }
     
  }

module.exports.validateReviews = (req, res, next)=>{
     const result= reviewSchema.validate(req.body);
     if(result.error){
       throw new expressError(400, result.error.details.map(el=>el.message).join(","));
    }else{
      next();
    }
}

