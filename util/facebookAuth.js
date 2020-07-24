const queryString = require('query-string');
const config = require('../config/config_dev.json')
const axios = require('axios');
const expObj = {}

/**********/
/** MAIN **/
/**********/

/**
 * Part 1: Create a Facebook Authorize URL and send to the client to log in the user.
 */

expObj.urlFacebook = ()=>{
const stringifiedParams = queryString.stringify({
  client_id: process.env.FACEBOOK_APP_ID,
  redirect_uri: process.env.REDIRECT_URL,
  scope: ['email','user_photos'].join(','), // comma seperated string
  response_type: 'code',
  display: 'popup'
});
const facebookLoginUrl = `${config.FACEBOOK_AUTH_URL}${stringifiedParams}`;
console.log("facebook url",facebookLoginUrl)
    return facebookLoginUrl;
  }




  expObj.getFacebookAccessTokenStub = async(code)=>{
  return ({"access_token":"EAAIG0HmgcPABAGXUUiL7AIGNzHMjUBC4yXJtvpvXIchOuEroA2PyLFHTSNl1OnXM0jI4hmzu6q9HBImdS2e3TAYQfYqK96OxHpNOPh5D6Bx6530C54sdV9pobWR7tidSgECBogpSdnePoZCYzQRc6mNI7qdrnCArwDEw6swZDZD","token_type":"bearer","expires_in":5177146})
};


  
  expObj.getFacebookAccessToken = async(code)=>{
      console.log("facebook code",JSON.stringify(code))
    const { data } = await axios({
      url: 'https://graph.facebook.com/v7.0/oauth/access_token',
      method: 'get',
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: process.env.REDIRECT_URL,
        code,
      },
    });
    console.log("token",JSON.stringify(data)); // { access_token, token_type, expires_in }
    return data;
  };


 expObj.getFacebookUserData = async (access_token)=>{
  const { data } = await axios({
    url: 'https://graph.facebook.com/me',
    method: 'get',
    params: {
      fields: ['id', 'email', 'first_name', 'last_name','picture.type(large)'].join(','),
      access_token: access_token,
    },
  });
  console.log("userProfile",data); // { id, email, first_name, last_name }
  data.token = access_token
  return data;
};


expObj.verifyToken = async(jwt, sign)=>{
  let signature = process.env.FB_PRIVATE_KEY
  console.log("facebook tokne")
  return {'authenticate':true}

}



  module.exports = expObj




//   const axios = require('axios')

// async function getFacebookUserData(access_token) {
//   const { data } = await axios({
//     url: 'https://graph.facebook.com/me',
//     method: 'get',
//     params: {
//       fields: ['id', 'email', 'first_name', 'last_name','picture.type(large)'].join(','),
//       access_token: access_token,
//     },
//   });
//   console.log(data); // { id, email, first_name, last_name }
//   return data;
// };

// getFacebookUserData('EAAIG0HmgcPABAEdLa3UZBnG7w5DALvWqf88jBY5ZBNl8F9dAZBQLlEsauA3kU3wJO3FewWhIMvTGExXzHhfj75ZCUuYDrs8meaTlrp0tJv83t4aC6Xnj77R11S4qFqJYacQQ6ajnnZChRuxOqtiq2opEjuBkbpOpQZB4hd396gJ1AcdBUOKHjqSj3G98c26s8uG1ijYmSvOQZDZD')


// $ curl -X GET "https://graph.facebook.com/v2.7/me/permissions?access_token=${token}"
// {"data":[{"permission":"user_friends","status":"granted"},{"permission":"email","status":"granted"},{"permission":"manage_pages","status":"granted"},{"permission":"business_management","status":"granted"},{"permission":"pages_messaging","status":"granted"},{"permission":"pages_messaging_phone_number","status":"granted"},{"permission":"public_profile","status":"granted"}]}
// Do revoke request:

// $ curl -X DELETE "https://graph.facebook.com/v2.7/me/permissions?access_token=${token}"
// {"success":true}
// Verify revoke:

// $ curl -X GET "https://graph.facebook.com/v2.7/me/permissions?access_token=${token}"
// {"error":{"message":"Error validating access token: The session was invalidated explicitly


// https://graph.facebook.com/v7.0/oauth/access_token?  
// grant_type=fb_exchange_token&          
// client_id=570442416943344&
// client_secret=cf5e719c7ba356ac8a43bb6df0c441ed&
// fb_exchange_token=EAAIG0HmgcPABAFCgAU1oZAOuZAdu8VZAUB0aCUZB0vafbuv46FsBUsMTnEWfcRZBlnilnu79AAX36AVuLvfPIzNlObUusB1zWCsr20fgBtI85QhsZC8GJEJTo3vMpISNeVT3Q1rEQ5CNn7MW9ZAdOTDN9aiAlfK8yNQpuBDzAVB1QZDZD


// const axios = require('axios')

// async function getFacebookUserData(access_token) {
//   const { data } = await axios({
//     url: 'https://graph.facebook.com/v7.0/oauth/access_token',
//     method: 'get',
//     params: {
//       fb_exchange_token:'EAAIG0HmgcPABAFCgAU1oZAOuZAdu8VZAUB0aCUZB0vafbuv46FsBUsMTnEWfcRZBlnilnu79AAX36AVuLvfPIzNlObUusB1zWCsr20fgBtI85QhsZC8GJEJTo3vMpISNeVT3Q1rEQ5CNn7MW9ZAdOTDN9aiAlfK8yNQpuBDzAVB1QZDZD',
//       grant_type:'fb_exchange_token',
//       client_id:'570442416943344',
//       client_secret:'cf5e719c7ba356ac8a43bb6df0c441ed'
//     },
//   });
//   console.log(data); // { id, email, first_name, last_name }
//   return data;
// };

// getFacebookUserData()

// https://graph.facebook.com/v7.0/oauth/access_token?grant_type=fb_exchange_token&client_id=570442416943344&client_secret=cf5e719c7ba356ac8a43bb6df0c441ed&fb_exchange_token=EAAIG0HmgcPABAFCgAU1oZAOuZAdu8VZAUB0aCUZB0vafbuv46FsBUsMTnEWfcRZBlnilnu79AAX36AVuLvfPIzNlObUusB1zWCsr20fgBtI85QhsZC8GJEJTo3vMpISNeVT3Q1rEQ5CNn7MW9ZAdOTDN9aiAlfK8yNQpuBDzAVB1QZDZD


// {
//   error: {
//     message: 'Error validating access token: The session has been invalida
// ted because the user changed their password or Facebook has changed the se
// ssion for security reasons.',
//     type: 'OAuthException',
//     code: 190,
//     error_subcode: 460,
//     fbtrace_id: 'Addm6deOxf8BMtslJ5m9bLZ'
//   }
// }

// {
//   error: {
//     message: 'Error validating access token: The user has not authorized a
// pplication 570442416943344.',
//     type: 'OAuthException',
//     code: 190,
//     error_subcode: 458,
//     fbtrace_id: 'AqEM3DM8droihSbPhZoe7Cx'
//   }
// }