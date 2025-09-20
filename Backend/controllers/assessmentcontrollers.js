const Assessment = require('../models/assessment');
const axios = require('axios');
const FormData = require('form-data');
const User = require('../models/user');
const Media = require('../models/media');
const cloudinary = require('../utils/cloudinary');



exports.performOne = async (req, res) => {
  try {
    const userId = req.user.id;
    const exercise_type = req.body.exercise_type;

    // Create form-data
    const form = new FormData();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    userheight = user.height_cm;

    // Add exercise_type
    form.append('exercise_type', exercise_type);

    // Add video (first file assumed to be video)
    const videoFile = req.files.find(f => f.mimetype.startsWith('video/'));
    if (videoFile) {
      form.append('video', videoFile.buffer,  videoFile.originalname );
    }

    // Add images (remaining files)
    const imageFiles = req.files.filter(f => f.mimetype.startsWith('image/'));
    imageFiles.forEach(img => {
      form.append('reference_images', img.buffer,  img.originalname );
    });

    // Add user height and other required parameters
    form.append('user_height_cm', userheight);
    form.append('generate_video', 'true');
    form.append('save_json', 'true');
    form.append("user_id", userId);

    // Send to Flask
    const response = await axios.post(
      'http://127.0.0.1:5000/analyze_mobile',
      form,
      { headers: form.getHeaders() }
    );
    console.log(response)
    // ========== NEW CODE STARTS HERE ==========
    // Extract data from Flask response
    const { generated_video_base64, saved_json_content } = response.data;
    const { rep_count } = saved_json_content.performance_results;

    // Step 1: Upload video to Cloudinary
    const videoUploadResult = await cloudinary.uploader.upload(
      `data:video/mp4;base64,${generated_video_base64}`,
      {
        folder: 'SIH',
        resource_type: 'video',
        type: 'upload'
      }
    );

    // Step 2: Save to Media model
    const newMedia = new Media({
      userId: userId,
      media: [{
        title: `Assessment-${exercise_type}-${Date.now()}`,
        type: 'video',
        url: videoUploadResult.secure_url,
        public_id: videoUploadResult.public_id
      }]
    });
    const savedMedia = await newMedia.save();
    const mediaId = savedMedia._id;

    // Step 3: Create Assessment record
    const newAssessment = new Assessment({
      userId: userId,
      assessmentName: exercise_type,
      assessmentVerification:"verified",
      mediaId: mediaId,
      RepCount: rep_count || 0
    });
    const savedAssessment = await newAssessment.save();

    // Step 4: Send response
    res.json({
      success: true,
      assessment: savedAssessment,
      media: savedMedia,
      
    });
    // ========== NEW CODE ENDS HERE ==========

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};



exports.getFinalResult = async (req , res) => {
    try{
      const userId = req.user.id;
      const form = new FormData();
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      form.append("user_id", userId);
      const flaskresponse = await axios.post('http://127.0.0.1:5000/comprehensiveAnalysis',
        form, 
        { headers: form.getHeaders() }
      );
      res.json(flaskresponse.data);
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}