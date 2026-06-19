const joi = require("joi");

let listingSchema = joi.object(
    {
            title:joi.string().required(),
            description:joi.string().required(),
            image:joi.string().allow("",null),
            price:joi.number().min(0).required(),
            location:joi.string().required(),
            country:joi.string().required()
        
    }
).required();

module.exports= listingSchema;