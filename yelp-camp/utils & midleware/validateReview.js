const Joi = require("joi");

const schema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  body: Joi.string(),
});

const validateReview = (e) => {
    return schema.validate(e);
};


module.exports = { validateReview };
