const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl, isLoggedIn} = require("../middleware.js");
const {signupPost, loginPost, logout, getCurrentUser}= require('../controllers/user.constroller.js');
const { userBookings } = require('../controllers/booking.controller.js');
const router = express.Router();

// POST signup
router.post("/signup", wrapAsync(signupPost));

// POST login
const authenticateUser = (req, res, next) => {
	passport.authenticate("local", (err, authenticatedUser, info) => {
		if (err) return next(err);
		if (!authenticatedUser) {
			return res.status(401).json({
				message: info?.message || "Invalid username or password"
			});
		}

		req.logIn(authenticatedUser, (loginError) => {
			if (loginError) return next(loginError);
			next();
		});
	})(req, res, next);
};

router.post("/login", saveRedirectUrl, authenticateUser, loginPost);

// GET current user
router.get("/me", getCurrentUser);
router.get("/bookings", isLoggedIn, wrapAsync(userBookings));

// POST logout
router.post("/logout", logout);

module.exports = router;
