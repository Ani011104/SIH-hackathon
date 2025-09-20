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
    assessmentVerification:{
        type:String,
        default:"not verified",
        enum:["not verified","verified"]
    
    },
    // mediaId:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"Media",
    //     required:true
    // },
    RepCount:{
        type:Number,
        default:0
    }
}, { timestamps: true })

const Assessment = mongoose.model("Assessment",assessmentSchema)
module.exports = Assessment;
