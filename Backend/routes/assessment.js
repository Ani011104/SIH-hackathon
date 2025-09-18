const router = require("express").Router();
const upload = require('../middleware/muter2');
const verifytoken = require('../middleware/verifytoken');
const verifyadmin = require('../middleware/verifyadmin');
const { performOne } = require('../controllers/assessmentcontrollers');
const { getFinalResult } = require('../controllers/assessmentcontrollers');
// one route to perform each exercise
// one route to get the final result of the assessment

router.post("/perform_one", verifytoken, upload.array('file'), performOne )

router.post("/get_final_result", verifytoken, getFinalResult)

module.exports = router;
