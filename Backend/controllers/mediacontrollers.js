const mongoose = require("mongoose");
const Media = require("../models/media");
const User = require("../models/user");
const { generateSignedUrl }= require("../utils/generatesignedurl");
const cloudinary = require("../utils/cloudinary");

exports.postMedia = async (req , res) => {
    try {
        const userId = req.user.id;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if media is uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No media uploaded" });
        }

        // Map files to media array
        const mediaArray = req.files.map((file) => {
            const mediaItem = {
                title: file.originalname,
                type: file.mimetype.startsWith("image/") ? "image" : "video",
                url: file.path,
                public_id: file.filename,
            };
            if (req.body.assessmentId) {
                mediaItem.assessmentId =  new mongoose.Types.ObjectId(req.body.assessmentId);
            }
            return mediaItem;
        });

        // Create new Media document
        const newMedia = new Media({
            userId: userId,
            media: mediaArray,
        });

        await newMedia.save();

        res.status(201).json({
            message: "Media uploaded successfully",
            media: newMedia,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}


exports.getMedia = async (req, res) => {
  try {
    const userID = req.user.id;

    // check if user exists
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if media exists
    const media = await Media.find({ userId: userID });
    if (media.length === 0) {
      return res.status(404).json({ message: "No media found" });
    }

    // generate signed url for each media item
    const signedMedia = media.map((mediaDoc) => {
      const obj = mediaDoc.toObject();
      
      // Generate signed URLs for each media item in the media array
      obj.media = obj.media.map((mediaItem) => {
        return {
          ...mediaItem,
          url: generateSignedUrl(mediaItem.public_id, mediaItem.type)
        };
      });
      
      return obj;
    });

    res.status(200).json({
      message: "Media retrieved successfully",
      media: signedMedia,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.deleteMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { mediaId, parentId } = req.body; 
    // mediaId = the _id of the image/video inside media array
    // parentId = the _id of the parent Media doc

    const parentDoc = await Media.findOne({ _id: parentId, userId });
    if (!parentDoc) {
      return res.status(404).json({ message: "Media document not found" });
    }

    const mediaItem = parentDoc.media.id(mediaId);
    if (!mediaItem) {
      return res.status(404).json({ message: "Media item not found" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(mediaItem.public_id, {
      resource_type: mediaItem.type === "video" ? "video" : "image",
    });

    // Remove from MongoDB array
    await Media.updateOne(
      { _id: parentId, userId },
      { $pull: { media: { _id: mediaId } } }
    );

    res.status(200).json({ message: "Media deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
