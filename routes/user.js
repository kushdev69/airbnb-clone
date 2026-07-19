const express = require("express");
const expressError = require("../utils/expressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const flash = require("connect-flash");
const passport = require("passport");
const { reviewSchema } = require("../schema.joi.js"); //validation schema with joi
const user = require("../models/users.js"); //user model
const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("listing/signup");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newuser = new user({ email, username });
      let registeruser = await user.register(newuser, password);
      req.flash("success", "user created succesfully");
      res.redirect("/listings");
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
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: true,
  }),
  (req, res) => {
   req.flash("success","user logged in successfully")
   res.redirect("/listings")
  },
);
module.exports = router;
