const googleutility = require('../util/googleAuth')
const facebookUtility = require('../util/facebookAuth')
const commonController = require('../controller/common.js')
let exportObj = {}


exportObj.googleAutorizeUrl = (req, res)=>{
    const URL = googleutility.urlGoogle()
    console.log("google url",JSON.stringify(URL))
    res.status(200)
    res.send(URL)
}

exportObj.facebookAuthorizeUrl = (req, res)=>{
    const URL = facebookUtility.urlFacebook()
    console.log("sending url facebook",JSON.stringify(URL))
    res.status(200)
    res.send(URL)
}

exportObj.facebookToken = (req, res)=>{
    facebookUtility.getFacebookAccessTokenStub(req.query.code)
    .then(token=>{
        return facebookUtility.getFacebookUserData(token.access_token)
    })
    .then(userDetail=>{
        console.log("sdfsdfs",commonController)
        return commonController.commonObj.generateJWT(userDetail)
    })
    .then(response=>{
        console.log("token",response)
        return commonController.commonObj.setCookie(req, res, response.id_token ,response.sign,'facebook')
    })
    .catch(err=>{
        return exportObj.error(req, res, 401)
    })
}




exportObj.googleToken = (req, res)=>{
        // res.cookie('id_token' ,"hithisisidtoken", { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
    // res.json({"status":true}).end();
    console.log("code",req.query.code)
    googleutility.getGoogleAccountFromCode(req.query.code)
    .then(token=>{
        if(!token) return exportObj.error(req, res, 401)
        console.log("tokenss",JSON.stringify(token))
    let {refresh_token, id_token} = token
    req.body.channel = 'google'
    return commonController.commonObj.setCookie(req, res, id_token,refresh_token)
    })
    .catch(err=>{

    })
}



exportObj.error = (req, res, code)=>{
    let cookie = req.cookies;
  
    for (var prop in cookie) {
       // console.log(prop)
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }    
        res.cookie(prop, '', {expires: new Date(0)});
    }
    res.status(code)
    res.send('unauthorized').end()
}







module.exports = exportObj