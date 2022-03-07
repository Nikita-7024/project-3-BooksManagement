//new folder is middleware

const { append } = require("express/lib/response")
const { route } = require("../routes/route")

 
// const falana= function(req,res,next){

// let newHeader=req.headers["isfreeappuser"]
// console.log(newHeader)
// if(newHeader ==="false"){
// return res.send({ msg:"isFreeAppUser is not valid"})
// }else{
//     next()
// }


// }
// module.exports.falana= falana
// let middleware=function(req,res,next){
// let isfreeappuser=req.headers.isfreeappuser
// console.log(isfreeappuser)
// if(!isfreeappuser){
//     next()
// }
// else{
//     res.send("error")
// }
// }
// app.use(middleware)
// app.use('/',route)