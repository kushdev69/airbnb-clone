const listingmodel = require("../models/listings.js");  //listing model mongoose schema


//index route
module.exports.index=async (req, res) => {
  const allistings = await listingmodel.find({}).populate("owner");
  res.render("listing/listings", { allistings });
};

// 

module.exports.newListingGet =async (req, res) => {
  res.render("listing/new",{});
};

module.exports.newListingPost =async (req, res) => {
    let {title, description, price, location, country}= req.body;
        let {originalname ,url} = req.file;
    
    let newlisting = await listingmodel.create(
    {
      title, 
      description,
      price,
      location,
      country,
    }
  );  
  newlisting.image={
        url:url,
        filename:originalname
      };
  newlisting.owner= req.user._id;
  await newlisting.save();
  req.flash("success", "listing added successfully");
  res.redirect("/listings");
};


module.exports.showListing =async (req, res) => {
  let {id}= req.params;
  let listing = await listingmodel.findById(id).populate({path:"reviews", populate: {path:"author"}}).populate("owner");  
  if(!listing){
    req.flash("error", "listing you are trying to see is not availabe ");
    res.redirect("/listings");
  }else{
    res.render("listing/showlisting",{listing});
  }  
};

module.exports.updateListingGet=async (req, res) => {
  let {id}= req.params;
  let listing = await listingmodel.findById(id); 
  let originalurl= listing.image.url;
  originalurl= originalurl.replace("/uploads", "/uploads/h_100");
  console.log(originalurl )
  res.render("listing/edit",{listing , originalurl});
};

module.exports.updateListingPost= async (req, res) => {
  let {id}= req.params;
  let {title, description,image, price , country, location}= req.body;
  let listing = await  listingmodel.findById(id);
  let updatedlisting = await listingmodel.findOneAndUpdate({ _id:id}, 
    {title, description, image, price, country, location},  { returnDocument:"after"} 
  );  

  if(typeof req.file !== "undefined"){
    let {originalname, url}= req.file;
    updatedlisting.image={
      url:url,
      filename:originalname
    }
  }
  await updatedlisting.save();
  req.flash("success", "listing Updated!");
  res.redirect("/listings");
};


module.exports.deleteListing= async(req, res )=>{
  let {id}= req.params;
  let updatedlisting = await listingmodel.findByIdAndDelete(id);  
  req.flash("error", "listing Deleted ");
  res.redirect("/listings");
  
};