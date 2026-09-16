const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require("dotenv").config({ path: __dirname + '/.env' });
console.log('ATLASDB_URL:', process.env.ATLASDB_URL);
console.log('SECRET:', process.env.SECRET);
require("./db.js");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const expressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.joi.js");
const reviewmodel = require("./models/reviews.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const user = require("./models/users.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const listingmodel = require("./models/listings.js");
const methodoverride = require('method-override');
const cors = require("cors");

const app = express();

// Middleware
app.use(methodoverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Session configuration
const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600
});

store.on("error", (err) => {
  console.log("session store error:", err);
});

const sessionConfig = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false, // Set to true only when using HTTPS
    sameSite: 'lax'
  }
};

app.use(session(sessionConfig));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// Make user available to all routes
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// API Routes
app.use('/api/users', userRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/listings/:id/reviews', reviewsRouter);

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/dist')));
  
  // Handle React routing, return all non-API requests to React app
  app.get('/{*any}', (req, res, next) => {
    // Skip API routes - let them be handled by API routers or 404
    if (req.path.startsWith('/api/')) {
      return next(new expressError(404, "API Not Found"));
    }
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
  });
} else {
  // Development mode
  app.get('/', (req, res) => {
    res.json({ message: 'API Server Running. Frontend runs on port 5173' });
  });
}

// Error handling middleware
app.all("/*splat", (req, res, next) => {
  console.log("404 reached:", req.method, req.originalUrl);
  next(new expressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  console.log(err);
  let { status = 500, message = "something went wrong" } = err;
  
  // For API routes, return JSON
  if (req.path.startsWith('/api/')) {
    return res.status(status).json({ message });
  }
  
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app;
