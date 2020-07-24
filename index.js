const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const commonController = require('./controller/common')
const authRoute = require('./routes/authRoutes')
const PORT = 8082

const cookieParser = require('cookie-parser')

app.use(cookieParser())

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Pass to next layer of middleware
  next();
});


//imoprt route : auth route
const apiRoute = require('./routes/routes')


// route middlewares
// app.use('/api/auth',authRoute)
app.use("/auth",authRoute)
app.use("/api",commonController.commonObj.checkAuthorization,apiRoute)




// Create a Server
// var server = app.listen(PORT, () => {
//     const host = server.address().address
//     const port = server.address().port
//     dbConnection.initialize(dbConfig.dbName, dbConfig.collectionName)
//     .then(resp=>{
//         console.log("Connected to `" + dbConfig.dbName + "`!");
//         console.log("App listening at http://%s:%s", host, port); 
//     })
//     .catch(err=>{
//         console.log("Error in connection with DB",JSON.stringify(err));
//         console.log("App listening at http://%s:%s", host, port); 
//     })
//   })


var server = app.listen(PORT, () => {
  const host = server.address().address
    const port = server.address().port 
console.log("App listening at http://%s:%s", host, port); 
})



  process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })

process.on('unCaughtException', function(err){
	console.log(err);
	process.exit(1);
});
