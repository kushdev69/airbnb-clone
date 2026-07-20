const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const flash = require("connect-flash");
const passport = require("passport");
const {saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const {signupGet, signupPost, loginGet, loginPost, logout}= require('../controllers/user.constroller.js');
const router = express.Router();

// users/signup route get and post 
router.route("/signup")
.get(signupGet)
.post( wrapAsync(signupPost));

//users/login route get and post 
router.route("/login")
.get(loginGet )
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/users/login",failureFlash: true,
  }),loginPost );

//logout 
router.get("/logout", logout );

module.exports = router;
