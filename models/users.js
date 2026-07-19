const mongoose = require('mongoose');
const schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

let userSchema = new schema({
    email:{
        type:String,
        required:true,
        unique:true
     }
});

userSchema.plugin(passportLocalMongoose);
const user= mongoose.model("user",userSchema);

module.exports= user;                
