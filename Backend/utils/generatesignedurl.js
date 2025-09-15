const cloudinary = require("cloudinary").v2;

// generate a signed URL for a video or image
function generateSignedUrl(publicId, resourceType = "image") {
  const url = cloudinary.url(publicId, {
    resource_type: resourceType,  // "image" or "video"
    type: "private",        // important for signed URLs
    sign_url: true,               // tells Cloudinary to sign the URL
    expires_at: Math.floor(Date.now() / 1000) + 60, // expires in 5 min
  });
  return url;
}

module.exports = {
    generateSignedUrl,
}