const express = require("express");
const wrapAsync= require("../utils/wrapAsync.js");
const flash = require("connect-flash");
const passport = require("passport");
const {index, newListingGet, newListingPost, showListing, updateListingGet, updateListingPost, deleteListing} = require('../controllers/listing.controller.js')
const {validateListing , isOwner, isLoggedIn}= require("../middleware.js");
const multer = require("multer");
const { storage}  = require("../cloudConfig.js");
const upload = multer({storage});

const router= express.Router();

//create review path stars like listings/...
router.get("/", wrapAsync(index));

//new listing get and post route
router.route("/new")
.get( isLoggedIn, wrapAsync(newListingGet))
.post(isLoggedIn, upload.single('image'), validateListing, wrapAsync(newListingPost ));


//show listing route
router.get("/:id", wrapAsync(showListing));

// edit listing get and put route
router.route("/:id/edit")
.get(isLoggedIn, isOwner, wrapAsync(updateListingGet))
.put(isLoggedIn, isOwner, upload.single('image'), validateListing, wrapAsync(updateListingPost));

//delte listing route
router.get("/:id/delete", isLoggedIn, isOwner, wrapAsync(deleteListing));

module.exports= router;