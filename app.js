const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsmate = require("ejs-mate");
const expressError= require("./utils/expressError.js");  // custom error class
const {listingSchema, reviewSchema}= require("./schema.js"); //joi validation schema
const reviewmodel= require("./models/reviews.js");
const listings = require("./routes/listing.js");   //listing routes
const reviews = require("./routes/review.js");   //reviews routes


require("./db.js");
const listingmodel = require("./models/listings.js");
const app = express();

const methodoverride= require('method-override');  
app.use(methodoverride("_method"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsmate)



//routes
app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);




//middleware to handle errors
app.all("/*splat", (req, res, next) =>{
 console.log("404 reached:", req.method, req.originalUrl);
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
