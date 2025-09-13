const router = require('express').Router()
const { patchUser , getUser , getUsers , getUserbyId } = require('../controllers/usercontrollers')
const verifytoken = require('../middleware/verifytoken')
const verifyadmin = require('../middleware/verifyadmin')

router.patch('/updateuser', verifytoken , patchUser)
router.get('/getuser', verifytoken , getUser)
router.get('/getusers', verifyadmin , getUsers) // includes filters
router.get('getuser/:id', verifyadmin, getUserbyId)



module.exports = router