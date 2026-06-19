const mongoose = require('mongoose');

let userSchema= mongoose.Schema({
    title:{
        type:String,
         required:true,
     },
    description:String,
    image:{
          type:String,
         set: (v)=>v===""?"koistring":v,
     },
    price:Number,
    location:String,
    country:String,
})

const listing= mongoose.model("listing",userSchema);

module.exports= listing;                
