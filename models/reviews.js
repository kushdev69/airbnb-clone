const mongoose = require('mongoose');

let reviewSchema= mongoose.Schema({
    comment:{
        type:String
     },
    rating:{
          type:Number,
         min:1,
         max:5
     },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"user"
    }
})

const review= mongoose.model("review",reviewSchema);

module.exports= review;                
