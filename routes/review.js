const express = require("express");
const wrapAsync= require("../utils/wrapAsync.js");
const { isReviewOwner, validateReviews, isLoggedIn}= require("../middleware.js");
const {createReview, deleteReview} =require('../controllers/review.controller.js')

const router= express.Router( {mergeParams:true} );

//create review path stars like listings/:id/reviews.....
router.post("/",isLoggedIn ,validateReviews, wrapAsync(createReview));

//delete reviews
router.delete("/:re_id" ,isReviewOwner ,wrapAsync(deleteReview));


module.exports= router;
