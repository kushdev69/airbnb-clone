const express = require("express");
const expressError = require("../utils/expressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const flash = require("connect-flash");
const passport = require("passport");
const { reviewSchema } = require("../schema.joi.js"); //validation schema with joi
const user = require("../models/users.js"); //user model
const {saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("listing/signup");
});

router.post("/signup", wrapAsync(async (req, res ,next) => {
    try {
      let { username, email, password } = req.body;
      let newuser = new user({ email, username });
      let registeruser = await user.register(newuser, password);
      req.login(registeruser,(err)=>{
        if(err){
         return next(err);
        }
         req.flash("success", "user created successfully !")
         res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/users/signup");
    }
  }),
);

router.get("/login", (req, res) => {
  res.render("listing/login");
});

router.post(
  "/login" ,saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: true,
  }),
  (req, res) => {
   req.flash("success","user logged in successfully");
   let redirectUrl = res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl);
  },
);

router.get("/logout", (req, res,  next) => {
  req.logout((err)=>{
    if(err){
     return next(err);
    } 
    req.flash("success", "user logged out !")
    res.redirect("/listings");
    
  
  })
 
});


module.exports = router;
