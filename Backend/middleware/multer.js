const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require("../utils/cloudinary.js");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Detect if file is image or video by mimetype
        const isImage = file.mimetype.startsWith("image/");
        const isVideo = file.mimetype.startsWith("video/");

        return {
            folder: 'SIH',
            resource_type: isVideo ? 'video' : 'image', // Cloudinary needs this
            type:'private',
            allowed_formats: isImage ? ['jpg', 'jpeg', 'png', 'gif'] : ['mp4', 'mov', 'avi', 'mkv'],
        };
    }
});

const upload = multer({ storage });

module.exports = upload;
