const cloudinary = require("cloudinary");
const CloudinaryStorage= require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});

const storage =  CloudinaryStorage({
cloudinary,
folder: 'wanderlust-dev',
allowedFormats:['jpg', 'png', 'jpeg'],
});

module.exports= {
    cloudinary,
    storage,
}