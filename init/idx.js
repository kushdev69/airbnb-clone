const mongoose=require('mongoose');
const listing= require('../models/listing.js');
require('../db.js');
const initdata= require('./data.js');

async function dbinit() {
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
    console.log("data was inserted")
}

dbinit();