
const user = require('../models/users.js')

module.exports.signupGet =(req, res) => {
  res.render("listing/signup");
};

module.exports.signupPost = async (req, res ,next) => {
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
};

module.exports.loginGet =(req, res) => {
  res.render("listing/login");
};

module.exports.loginPost =(req, res) => {
   req.flash("success","user logged in successfully");
   let redirectUrl = res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl);
};

module.exports.logout =(req, res,  next) => {
  req.logout((err)=>{
    if(err){
     return next(err);
    } 
    req.flash("success", "user logged out !")
    res.redirect("/listings");
  })
};