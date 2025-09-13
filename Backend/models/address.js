const mongoose = require("mongoose")

const AddressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    State:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    District:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    AddressLine:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    PinCode:{
        type: String,
        required: true,
    },

}, {timestamps: true})

const Address = mongoose.model("Address", AddressSchema);
module.exports = Address;