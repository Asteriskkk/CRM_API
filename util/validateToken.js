let expObj = {}
const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


expObj.google = async(id_token)=>{
    try{
        const ticket = await client.verifyIdToken({
            idToken: id_token,
                  audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
                  // Or, if multiple clients access the backend:
                  //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
              });
              const payload = ticket.getPayload();
              const userid = payload['sub'];
              if(userid) return true
              return false

    }catch(err){
        console.log()
        if(err.name=='SyntaxError'){
            return false
        }else{
            if(err.name="Error" && err.message.indexOf('too late')){
                //refresh token
                console.log("need to refresh token")
                client.refreshAccessToken('1//0g5QZgLYtzAXMCgYIARAAGBASNwF-L9Irl6sKIAAShCmTvQ75Vi3OmEuzdWMxrM2ZenatZsRzM8ooD_1GcitSBtG3sEFYQo3QXKg',function(err, tokens) {
                    console.log("tokens",JSON.stringify(tokens),err)
                  });
            }else{
                return false
            }
        }
    }
}


expObj.facebook = (token,access_token)=>{

}

module.exports= expObj