const router=require('express').Router()
const userCtrl=require('../controllers/userCtrl')
const auth = require('../middleware/auth')


router.post('./register',userCtrl.register)
router.post('./login',userCtrl.login)
router.post('./logout',userCtrl.logout)
router.post('./infor',auth,userCtrl.getUser)
router.post('./refreshtoken',userCtrl.refreshtoken)

module.exports=router