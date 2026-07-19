const mongoose=require('mongoose');
const listing= require('../models/listings.js');
require('../db.js');
const initdata= require('./data.js');

async function dbinit() {
    await listing.deleteMany({});
    console.log("old data was deleted")
    // initdata.data = initdata.data.map((obj) => ({ ... obj, owner: "6a5cc1320d07c6c2226a2a8c" }));
    await listing.insertMany(initdata.data);
    console.log(" new data was inserted")
}

 
dbinit();