const Joi = require('joi');

const validatePhone = (phone) => {
  const phoneSchema = Joi.string().pattern(/^[6-9]\d{9}$/).required();
  return phoneSchema.validate(phone);
};

module.exports = validatePhone;