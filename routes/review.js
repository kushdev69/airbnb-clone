const express = require("express");
const wrapAsync= require("../utils/wrapAsync.js");
const { isReviewOwner, validateReviews, isLoggedIn}= require("../middleware.js");
const {createReview, deleteReview} =require('../controllers/review.controller.js')

const router= express.Router( {mergeParams:true} );

// POST create review
router.post("/", isLoggedIn, validateReviews, wrapAsync(createReview));

// DELETE review
router.delete("/:re_id", isReviewOwner, wrapAsync(deleteReview));


module.exports= router;
