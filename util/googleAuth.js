//import { google } from 'googleapis';
//this is alternate of above import
const {google} = require('googleapis');
const { auth } = require('google-auth-library');
const exportObj = require('../controller/auth');



require('dotenv').config()

const expObj = { }
/*******************/
/** CONFIGURATION **/
/*******************/

const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: process.env.REDIRECT_URL, // this must match your google api settings
};

const defaultScope = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

/*************/
/** HELPERS **/
/*************/

function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: defaultScope
  });
}

function getGooglePlusApi(auth) {
  return google.plus({ version: 'v1', auth });
}

/**********/
/** MAIN **/
/**********/

/**
 * Part 1: Create a Google URL and send to the client to log in the user.
 */

expObj.urlGoogle = ()=>{
  const auth = createConnection();
  const url = getConnectionUrl(auth);
  return url;
}

/**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */
expObj.getGoogleAccountFromCode = async(code)=>{

  try{
    const auth = createConnection();
    const data = await auth.getToken(code);
    const tokens = data.tokens;
    return tokens
  }catch(err){
    console.log(err,"error in token google")
    return null
  }
  

  // auth.refreshAccessToken(function(err, tokens) {
  //                   console.log("tokens",JSON.stringify(tokens),err)
  //                 });

 
}


expObj.refreshToken = async(refresh_token)=>{
  console.log("refresh token",refresh_token)
  const auth = createConnection();
  auth.setCredentials({
    refresh_token: refresh_token
  })

  try{
    const data = await auth.refreshAccessToken();
    const tokens = data.credentials;
    console.log("refresh token tokens",data)
    return tokens
  }catch(err){
    return null
  }

}


expObj.verifyToken = async(id_token, refresh_token)=>{
  const auth = createConnection();
  console.log('id token',id_token)


  try{
    let data = await auth.verifyIdToken({idToken:id_token})
    console.log("data token",data)
    const payload = data.getPayload();
    return {'authenticate':true}
  }catch(err){
    console.log("error***********",err)
    
    if(err.name=='SyntaxError'){
      return {'authenticate':false}
    }else{
        if(err.name="Error" || err.message.indexOf('too late')){
          console.log("token need to refresh**********")
          let token = await expObj.refreshToken(refresh_token)
          console.log("after rehresh token",token)
          if(token) return {'authenticate':true,token,'channel':'google'}
          return {'authenticate':false}
        }else{
          return {'authenticate':false}
        }
    }
}
}








module.exports = expObj




