const router = require("express").Router();
const verifytoken = require("../middleware/verifytoken")
// const verifyadmin = require("../middleware/verifyadmin")
const { postMyAddress } = require("../controllers/addresscontrollers")
const { getMyAddress } = require("../controllers/addresscontrollers")
const { updateMyAddress } = require("../controllers/addresscontrollers")
const { deleteMyAddress } = require("../controllers/addresscontrollers")

router.post("/postaddress", verifytoken , postMyAddress )
router.get("/getaddress", verifytoken , getMyAddress )
router.put("/updateaddress", verifytoken , updateMyAddress )
router.delete("/deleteaddress", verifytoken , deleteMyAddress )

module.exports = router