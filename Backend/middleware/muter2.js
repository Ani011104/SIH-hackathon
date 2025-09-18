// multerConfig.js
const multer = require('multer');

// Use memory storage to keep file in buffer
const storage = multer.memoryStorage();

// File filter to accept only images and videos
const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/gif',
        'video/mp4',
        'video/avi',
        'video/mov',
        'video/mkv'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and videos allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    }
});

module.exports = upload;