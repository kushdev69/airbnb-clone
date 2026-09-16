const listingmodel = require("../models/listings.js");  //listing model mongoose schema


//index route - GET all listings
module.exports.index=async (req, res) => {
  const allistings = await listingmodel.find({}).populate("owner");
  res.json(allistings);
};

module.exports.newListingPost =async (req, res) => {
    let {title, description, price, location, country}= req.body;
    
    let newlisting = await listingmodel.create(
    {
      title, 
      description,
      price,
      location,
      country,
    }
  );  
  
  if (req.file) {
    let {originalname ,url} = req.file;
    newlisting.image={
      url:url,
      filename:originalname
    };
  }
  
  newlisting.owner= req.user._id;
  await newlisting.save();
  res.status(201).json(newlisting);
};


module.exports.showListing =async (req, res) => {
  let {id}= req.params;
  let listing = await listingmodel.findById(id).populate({path:"reviews", populate: {path:"author"}}).populate("owner");  
  if(!listing){
    return res.status(404).json({ message: "Listing not found" });
  }
  res.json(listing);
};

module.exports.updateListingPost= async (req, res) => {
  let {id}= req.params;
  let {title, description, price , country, location}= req.body;
  
  let updatedlisting = await listingmodel.findOneAndUpdate({ _id:id}, 
    {title, description, price, country, location},  { returnDocument:"after"} 
  );  

  if(req.file){
    let {originalname, url}= req.file;
    updatedlisting.image={
      url:url,
      filename:originalname
    }
  }
  await updatedlisting.save();
  res.json(updatedlisting);
};


module.exports.deleteListing= async(req, res )=>{
  let {id}= req.params;
  await listingmodel.findByIdAndDelete(id);  
  res.json({ message: "Listing deleted successfully" });
};