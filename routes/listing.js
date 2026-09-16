const express = require("express");
const wrapAsync= require("../utils/wrapAsync.js");
const {index, newListingPost, showListing, updateListingPost, deleteListing} = require('../controllers/listing.controller.js')
const {validateListing , isOwner, isLoggedIn}= require("../middleware.js");
const multer = require("multer");
const { storage}  = require("../cloudConfig.js");
const upload = multer({storage});

const router= express.Router();

// GET all listings
router.get("/", wrapAsync(index));

// POST create new listing
router.post("/", isLoggedIn, upload.single('image'), validateListing, wrapAsync(newListingPost));

// GET single listing
router.get("/:id", wrapAsync(showListing));

// PUT update listing
router.put("/:id", isLoggedIn, isOwner, upload.single('image'), validateListing, wrapAsync(updateListingPost));

// DELETE listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(deleteListing));

module.exports= router;