let jwt = require('jsonwebtoken')
const userModel = require("../models/userModel")
const bookModel = require("../models/bookModel")


let authenticate = function (req, res, next) {
  //Token authentication......

  try {
    let xAuthToken = req.headers["x-api-key"]

    let decodedToken = jwt.verify(xAuthToken, 'nikita singh')
    if (!decodedToken) return res.status(401).send({ status: false, msg: "token is not valid" })

    // Token authorization-----------------------------

    req.user = decodedToken.autherID
  
  next(); 
  } 
  catch (err) {
    console.log("This is the error :", err.message)
    return res.status(500).send({ msg: "Error", error: err.message })
  }
}


  

module.exports.authenticate = authenticate;