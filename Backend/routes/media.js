const router = require("express").Router();
const upload = require("../middleware/multer");
const { postMedia } = require("../controllers/mediacontrollers");
const { getMedia } = require("../controllers/mediacontrollers");
const { deleteMedia } = require("../controllers/mediacontrollers");
const verifytoken = require("../middleware/verifytoken");
const verifyadmin = require("../middleware/verifyadmin");
//possible routes 
//1 post to get the user information (media) and store in cloud storage
router.post("/upload", verifytoken, upload.array('media'), postMedia);
//2 get route for the user to see their uploaded media only 
 router.get('/getmedia', verifytoken, getMedia);
//3 delete route for the user to delete their uploaded media
router.delete('/deletemedia', verifytoken, deleteMedia);

//admin routes 
//1 get route for the admin to see all the uploaded media with filter for a particular user
//2 delete route for the admin to delete any media

















module.exports = router;