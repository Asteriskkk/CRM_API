const router = require('express').Router()
const commonController = require('../controller/common')
const authController = require('../controller/auth')
const googleutility = require('../util/googleAuth')





router.get("/auth_provider/:provider",commonController.commonObj.generateUrl)


// router.get('/google',(req, res)=>{
//     const googleUrl = utility.urlGoogle()
//     console.log("google url",googleUrl)
//     res.redirect(googleUrl)
// })


router.get('/gauth/redirect',authController.googleToken)


router.get('/fauth/redirect', authController.facebookToken)



router.get('/logout',commonController.commonObj.logout)




module.exports = router