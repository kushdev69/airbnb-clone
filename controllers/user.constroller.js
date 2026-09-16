
const user = require('../models/users.js')

module.exports.signupPost = async (req, res ,next) => {
    try {
      let { username, email, password } = req.body;
      let newuser = new user({ email, username });
      let registeruser = await user.register(newuser, password);
      req.login(registeruser,(err)=>{
        if(err){
         return next(err);
        }
         res.status(201).json({ user: registeruser, message: "User created successfully" });
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
};

module.exports.loginPost =(req, res) => {
   res.json({ user: req.user, message: "User logged in successfully" });
};

module.exports.getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

module.exports.logout =(req, res,  next) => {
  req.logout((err)=>{
    if(err){
     return next(err);
    } 
    res.json({ message: "User logged out successfully" });
  })
};