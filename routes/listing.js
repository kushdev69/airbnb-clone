const express = require("express");
const wrapAsync= require("../utils/wrapAsync.js");
const flash = require("connect-flash");
const passport = require("passport");
const listingmodel = require("../models/listings.js");  //listing model mongoose schema
const {validateListing , isOwner, isLoggedIn}= require("../middleware.js");


const router= express.Router();


//index route
router.get("/", wrapAsync(async (req, res) => {
  const allistings = await listingmodel.find({}).populate("owner");
  res.render("listing/listings", { allistings });
}));


//new listing get route
router.get("/new", isLoggedIn, wrapAsync( async (req, res) => {
  
  res.render("listing/new",{});

}));


//new listing post route 
router.post("/new" ,isLoggedIn, validateListing, wrapAsync( async (req, res) => {
    let {title, description, image, price, location, country}= req.body;
    let newlisting = await listingmodel.create(
    {
      title, 
      description,
      image,
      price,
      location,
      country,
    }
  );  
    newlisting.owner= req.user._id;
  await newlisting.save();
  req.flash("success", "listing added successfully");
  res.redirect("/listings");
}));


//show listing route
router.get("/:id"  , wrapAsync( async (req, res) => {
  let {id}= req.params;
  let listing = await listingmodel.findById(id).populate({path:"reviews", populate: {path:"author"}}).populate("owner");  
  if(!listing){
    req.flash("error", "listing you are trying to see is not availabe ");
    res.redirect("/listings");
  }else{
    res.render("listing/showlisting",{listing});
  }  
}));



// edit listing get route
router.get("/:id/edit" ,isLoggedIn  ,isOwner,wrapAsync( async (req, res) => {
  let {id}= req.params;
  let listing = await listingmodel.findById(id); 
  res.render("listing/edit",{listing});
}
));

// update route
router.put ("/edit/:id"  ,isLoggedIn ,isOwner,validateListing, wrapAsync( async (req, res) => {
  let {id}= req.params;
  let {title, description,image, price , country, location}= req.body;
  let listing = await  listingmodel.findById(id);
  let updatedlisting = await listingmodel.findOneAndUpdate({ _id:id}, 
    {title, description, image, price, country, location},  { returnDocument:"after"} 
  );  
  req.flash("success", "listing Updated!");
  res.redirect("/listings");
}));

//delte listing

router.get("/:id/delete"  ,isLoggedIn ,isOwner ,wrapAsync( async(req, res )=>{
  let {id}= req.params;
  let updatedlisting = await listingmodel.findByIdAndDelete(id);  
  req.flash("error", "listing Deleted ");
  res.redirect("/listings");
  
}));

module.exports= router;