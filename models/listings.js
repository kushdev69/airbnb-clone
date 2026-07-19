const mongoose = require('mongoose');
let reviewmodel= require("./reviews.js");

let listingSchema= mongoose.Schema({
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
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"review",
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    }
});


//middleware to delete reivews when listing is deleted
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing.reviews.length){
      let result= await reviewmodel.deleteMany({ _id:{$in:listing.reviews}});
       console.log(result);     
    }

});

const listing= mongoose.model("listing",listingSchema);
module.exports= listing;                
