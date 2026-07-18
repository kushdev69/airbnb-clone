const express = require("express");
const expressError= require("../utils/expressError.js");
const wrapAsync= require("../utils/wrapAsync.js");
const flash = require("connect-flash");
const {listingSchema, reviewSchema}= require("../schema.js"); //validation schema with joi
const listingmodel = require("../models/listings.js");  //listing model mongoose schema


const router= express.Router();

function validateListing(req, res, next){
     const result= listingSchema.validate(req.body);
     if(result.error){
       throw new expressError(400, result.error.details.map(el=>el.message).join(","));
    }else{
      next();
    }
   
}

//index route
router.get("/", wrapAsync(async (req, res) => {
  const allistings = await listingmodel.find({});
  res.render("listing/listings", { allistings });
}));


//new listing get route
router.get("/new",wrapAsync( async (req, res) => {
  res.render("listing/new",{});
}));


//new listing post route 
router.post("/new", validateListing, wrapAsync( async (req, res) => {
    let {title, description, image, price, location, country}= req.body;
    let listing = await listingmodel.create(
    {
      title, 
      description,
      image,
      price,
      location,
      country,
    }
  );  
  req.flash("success", "listing added successfully");
  res.redirect("/listings");
}));


//show listing route
router.get("/:id",wrapAsync( async (req, res) => {
  let {id}= req.params;
  let listing = await listingmodel.findById(id).populate("reviews");  
  if(!listing){
    req.flash("error", "listing you are trying to see is not availabe ");
    res.redirect("/listings");
  }else{
    res.render("listing/showlisting",{listing});
  }  
}));



// edit listing get route
router.get("/:id/edit",wrapAsync( async (req, res) => {
  let {id}= req.params;
  let listing = await listingmodel.findById(id);  
  res.render("listing/edit",{listing});
}
));

// update route
router.put ("/edit/:id",validateListing, wrapAsync( async (req, res) => {
  let {id}= req.params;
  let {title, description,image, price , country, location}= req.body;
  let updatedlisting = await listingmodel.findOneAndUpdate({ _id:id}, 
    {title, description, image, price, country, location},  { returnDocument:"after"} 
  );  
  req.flash("success", "listing Updated!");
  res.redirect("/listings");
}));

//delte listing

router.get("/:id/delete" ,wrapAsync( async(req, res )=>{
  let {id}= req.params;
  let updatedlisting = await listingmodel.findByIdAndDelete(id);  
  req.flash("error", "listing Deleted ");
  res.redirect("/listings");
  
}));

module.exports= router;