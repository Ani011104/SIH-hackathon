const Joi = require("joi");

const AddressSchema = Joi.object({
    State: Joi.string().required().trim().lowercase(),
    District: Joi.string().required().trim().lowercase(),
    AddressLine: Joi.string().required().trim().lowercase(),
    PinCode: Joi.string().required().trim().lowercase(),
})

const validateAddress = (address) =>{
    return AddressSchema.validate(address)
}

module.exports = validateAddress