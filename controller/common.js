const authController = require('./auth')
const jwt = require('jsonwebtoken');
const validateToken = {
    google : require('../util/googleAuth'),
    facebook : require('../util/facebookAuth')
}

let commonObjs = {}
require('dotenv').config()

commonObjs.generateUrl = (req, res)=>{
    const provider = req.params.provider
    switch(provider){
        case "google": return authController.googleAutorizeUrl(req,res);
        case "facebook":return authController.facebookAuthorizeUrl(req, res);
        default:break;
    }
}

commonObjs.logout = (req, res)=>{
    console.log("cookie",JSON.stringify(req.cookies))
    cookie = req.cookies;
  
    for (var prop in cookie) {
       // console.log(prop)
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }    
        res.cookie(prop, '', {expires: new Date(0)});
    }
    res.status(200).json({'status':true}).end()
}


commonObjs.generateJWT = async(userDetail)=>{
    const privateKey = process.env.PRIVATE_KEY
    let token = userDetail.token
    let payload = userDetail
    delete payload.token
    let jwtToken = jwt.sign(payload, privateKey, { algorithm: 'HS256'});
    return {'id_token':jwtToken,'sign':token}
}

commonObjs.setCookie = (req, res,id_token,token, next) => {
    console.log("tokens",{id_token,token})
    let channel = req.cookies.channel || req.body.channel
    let tokenSplit = id_token.split(".")
    res.cookie('header',tokenSplit[0])
    res.cookie('payload',tokenSplit[1])
    res.cookie('channel',channel)
    res.cookie('private' ,tokenSplit[2], { httpOnly: true });
    res.cookie('sign',token,{ httpOnly: true })
    if(next) {next()}
    else{res.status(200).json({"status":true}).end();} 
     
 }


 commonObjs.checkAuthorization = (req, res, next)=>{

     let jwt = formJWT(req.cookies)
     try{
         const {channel} = req.cookies

        validateToken[channel].verifyToken(jwt,req.cookies.sign)
         .then(status=>{
             console.log("Status****",JSON.stringify(status))
             if(status.authenticate){
                 if(status.token){
                     commonObjs.setCookie(req, res, status.token.id_token,status.token.refresh_token, next)
                 }else{
                     next()
                 }
             }
             else{
                authController.error(req, res ,403)
             }
         })
         .catch(err=>{
             console.log(err)
             authController.error(req, res ,403)
         })
     }catch(err){
         console.log(err)
         authController.error(req, res ,403)
     }
     
 }


 function formJWT(cookie){
    const {header,payload,private,channel} = cookie
     if(channel=='facebook') return  [header,payload,process.env.PRIVATE_KEY].join('.')
     return [header,payload,private].join('.')
 }








module.exports.commonObj = commonObjs