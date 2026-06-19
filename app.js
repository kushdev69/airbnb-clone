const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsmate = require("ejs-mate");
const expressError= require("./utils/expressError.js");
const wrapAsync= require("./utils/wrapAsync.js");
const listingSchema= require("./schema.js");


require("./db.js");
const listingmodel = require("./models/listing.js");
const app = express();

const methodoverride= require('method-override');
app.use(methodoverride("_method"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsmate)

app.get("/", (req, res) => {
  res.redirect("/listings");
});


function validateListing(req, res, next){
     const result= listingSchema.validate(req.body);
    //  console.log(error);
     if(result.error){
       throw new expressError(400, result.error.details.map(el=>el.message).join(","));
    }else{
      next();
    }
   
}

//index route
app.get("/listings", wrapAsync(async (req, res) => {
  const allistings = await listingmodel.find({});
  res.render("listing/listings", { allistings });
}));


//new listing get route
app.get("/listings/new",wrapAsync( async (req, res) => {
  res.render("listing/new",{});
}));


//new listing post route 
app.post("/new/listing", validateListing, wrapAsync( async (req, res) => {

 
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
  res.redirect("/listings");
}));


//show listing route
app.get("/listings/:id",wrapAsync( async (req, res) => {
  let {id}= req.params;
  let listing = await listingmodel.findById(id);  
  res.render("listing/showlisting",{listing});
}));



// edit listing get route
app.get("/listings/:id/edit",wrapAsync( async (req, res) => {
  let {id}= req.params;
  let listing = await listingmodel.findById(id);  
  res.render("listing/edit",{listing});
}
));

// update route
app.put ("/edit/:id",validateListing, wrapAsync( async (req, res) => {
  let {id}= req.params;
  let {title, description,image, price}= req.body;
  let updatedlisting = await listingmodel.findOneAndUpdate({ _id:id}, 
    {title, description, image, price},  { returnDocument:"after"} 
  );  
  res.redirect("/listings");
}));

//delte listing

app.get("/listing/:id/delete" ,wrapAsync( async(req, res )=>{
  let {id}= req.params;
  let updatedlisting = await listingmodel.findOneAndDelete({ _id:id});  
  res.redirect("/listings");
  
}));

//middleware to handle errors
app.all("/*splat", (req, res, next) =>{
 next( new expressError(404, "Page Not Found!"));

})

app.use((err, req, res , next )=>{
console.log(err);   
let {status=500 , message="something went wrong" }= err;
res.status(status).render("listing/errors", {message});
});



app.listen("3000", () => {
  console.log("server started on port 3000");
});
