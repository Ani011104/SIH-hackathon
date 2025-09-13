const mongoose = require('mongoose')

// Use Schema must contain user name , phone number , height , weight , gender , age , isphonenumber verified , email id if present 
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        maxlength: 20,
        required: false,
        // we will not make this required because we will be creating a new user when using phone number and otp only 

    },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => /^[6-9]\d{9}$/.test(v),
            message: (props) => `${props.value} is not a valid indian phone number!`,
        },
    },
    height: {
        type: Number,
        required: false,
    },
    weight: {
        type: Number,
        required: false,
    },
    gender: {
        type: String,
        required: false,
        lowercase: true,
    },
    age: {
        type: Number,
        required: false,
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
    },
    email: {
        type: String,
        unique: true,
    },
    role: {
        type: String,
        default: 'user',
    },

} , {timestamps: true})

const User = mongoose.model('User', UserSchema)
module.exports = User
