const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require("../utils/cloudinary.js");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isImage = file.mimetype.startsWith("image/");
        const isVideo = file.mimetype.startsWith("video/");

        return {
            folder: 'SIH',
            resource_type: isVideo ? 'video' : 'image',
            type: 'private',
            allowed_formats: isImage ? ['jpg', 'jpeg', 'png', 'gif'] : ['mp4', 'mov', 'avi', 'mkv'],
        };
    }
});

// Custom storage that saves to Cloudinary AND preserves buffer
const customStorage = multer.memoryStorage();

const upload = multer({ 
    storage: customStorage,
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
            'video/mp4', 'video/avi', 'video/mov', 'video/mkv'
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    },
    limits: { fileSize: 100 * 1024 * 1024 }
});

// Middleware that uploads to Cloudinary after multer processes files
const uploadWithCloudinary = (req, res, next) => {
    upload.array('files')(req, res, async (err) => {
        if (err) return next(err);
        
        try {
            // Upload each file to Cloudinary while preserving buffer
            for (let file of req.files) {
                const isVideo = file.mimetype.startsWith('video/');
                
                const result = await cloudinary.uploader.upload(
                    `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
                    {
                        folder: 'SIH',
                        resource_type: isVideo ? 'video' : 'image',
                        type: 'private'
                    }
                );
                
                // Add Cloudinary properties while keeping buffer
                file.path = result.secure_url;
                file.filename = result.public_id;
            }
            
            next();
        } catch (error) {
            next(error);
        }
    });
};

module.exports = uploadWithCloudinary;