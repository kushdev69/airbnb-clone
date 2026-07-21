const joi = require("joi");

let listingSchema = joi.object(
    {
            title:joi.string().required(),
            description:joi.string().required(),
            image:joi.object({
                url: joi.string().allow("",null),
                filename: joi.string().allow("",null),
            }),
            price:joi.number().min(0).required(),
            location:joi.string().required(),
            country:joi.string().required(),
        
    }
).required();


const reviewSchema = joi.object({
    review: joi.object({
        comment: joi.string().required(),
        rating: joi.number().min(0).max(5).required(),
        date: joi.date().allow("", null)
    }).required()
});

module.exports= {listingSchema, reviewSchema};

