const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    media: [
      {
        title: {
          type: String, 
          trim: true,
        },
        type:{
            type: String,
            enum: ["image", "video"],
            required: true,
        },
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String, 
          required: true,
        },
        assessmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assessment",
            required: false
        }
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", mediaSchema);
