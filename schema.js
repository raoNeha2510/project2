//  thisfile for validate schema of listings
// using joi npm package joi
 const joi=require('joi');
module.exports.listingSchema=joi.object({
    listing:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        location:joi.string().required(),
        country:joi.string().required(),
        price:joi.string().required().min(0),
        image:joi.string().required().allow("",null),

    }).required(),

});

module.exports.reviewSchema=joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required(),
    }).required(),
});