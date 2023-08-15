const Joi = require("joi");

const schema = Joi.object({
  title: Joi.string().required(),
  location: Joi.string().required(),
  // image: Joi.string().required(),
  price: Joi.number().min(1).required(),
  description: Joi.string(),
});

const validateCampground = (e) => {
  return schema.validate(e);
};

module.exports = {validateCampground};
