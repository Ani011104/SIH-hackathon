const mongoose = require("mongoose")

const assessmentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    assessmentName:{
        type:String,
        required:true
    },
    assessmentScore:{
        type:Number,
        default:0
    },
    assessmentVerification:{
        type:String,
        default:"not verified",
        enum:["not verified","verified"]
    
    }
    

})

const Assessment = mongoose.model("Assessment",assessmentSchema)
module.exports = Assessment;