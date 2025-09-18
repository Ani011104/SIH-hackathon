const Assessment = require('../models/assessment');
const axios = require('axios');
const FormData = require('form-data');
const User = require('../models/user');



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

    // Send to Flask
    const response = await axios.post(
      'http://127.0.0.1:5000/analyze_mobile',
      form,
      { headers: form.getHeaders() }
    );

    res.json(response.data);
    console.log(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};



exports.getFinalResult = async (req , res) => {
    try{

    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}