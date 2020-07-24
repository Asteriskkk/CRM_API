const router = require('express').Router()
const commonController = require('../controller/common').commonObj
const authController = require('../controller/auth')
const googleutility = require('../util/googleAuth')



router.get("/data",(req, res)=>{
    console.log(req.cookies)

  })
  

router.get('/home',(req, res)=>{
    res.send("this is home page")
})





module.exports = router