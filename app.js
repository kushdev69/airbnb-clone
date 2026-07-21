require("dotenv").config();
require("./db.js");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsmate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const expressError= require("./utils/expressError.js");  // custom error class
const {listingSchema, reviewSchema}= require("./schema.joi.js"); //joi validation schema
const reviewmodel= require("./models/reviews.js");
const listingsRouter = require("./routes/listing.js");   //listing routes
const reviewsRouter = require("./routes/review.js");   //reviews routes
const userRouter = require("./routes/user.js");   //users routes
const user = require("./models/users.js")
const passport = require("passport");
const LocalStrategy = require("passport-local");


const listingmodel = require("./models/listings.js");
const app = express();

const methodoverride= require('method-override');  
const { register } = require("module");
const listing = require("./models/listings.js");
app.use(methodoverride("_method"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsmate)

const sessionConfig= {
  secret:"myseretstringforuse",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now()+ 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
}

//routes
app.get("/", (async (req, res) => {
     res.redirect("/listings");
}));

app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res ,next)=>{
  res.locals.success= req.flash("success");
  res.locals.error= req.flash("error");
  res.locals.currUser= req.user;
  next();
})

app.use('/users', userRouter);
app.use('/listings', listingsRouter);
app.use('/listings/:id/reviews', reviewsRouter);




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
