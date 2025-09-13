const Joi = require("joi")


const UserSChema = Joi.object({
    username: Joi.string().min(3).max(20).required().lowercase().trim(),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    height: Joi.number().required(),
    weight: Joi.number().required(),
    gender: Joi.string().required(),
    Dob: Joi.date().required(),
    email: Joi.string().email().optional()
    
})

const validateuser = (user) =>{
    return UserSChema.validate(user)
}

module.exports = validateuser