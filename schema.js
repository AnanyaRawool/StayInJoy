const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country:  Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),

         // tax
         taxRate: Joi.number().min(0).max(100),
     }).required(),
});

//creating review schema
module.exports.reviewSchema = Joi.object({
     review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
     }).required(), //if we get any review request then it should have review object so 'requried'
});



//feauture of filter like farm , dome , camp
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
        taxRate: Joi.number().min(0).max(100),

        // ✅ add this
        category: Joi.string(),

    }).required(),
});


