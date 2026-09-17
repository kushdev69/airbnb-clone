
const mongoose = require('mongoose');

mongoose.connect(process.env.ATLASDB_URL)
.then(()=>{
    console.log("mongodb is connected !");
})
.catch((err)=>{
    console.log(`mongodb connection failed: ${err.message}`);
});