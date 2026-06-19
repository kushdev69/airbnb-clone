const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost:27017/wanderlust`)
.then(()=>{
    console.log("mongodb is connected !");
})
.catch((err)=>{
    console.log(`error : ${err}`);
})