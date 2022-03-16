let jwt = require('jsonwebtoken')
const BlogModel = require("../models/blogModel")
let authenticate = function (req, res, next) {
//Token authentication......

  try {
    let xAuthToken = req.headers["x-api-key"]
    if (xAuthToken != undefined) {

      console.log("done")
      next()
    }
    else {
      res.send("request is missing a mandatory header")
    }
  }
  catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
  }
}
//Token authorisation.......

let authorise = async function (req, res, next) {
  // comapre the logged in user's id and the id in request
  try {
    let token = req.headers["x-api-key"]
    let blogID = req.params.blogID;
    let deleteData = await BlogModel.findById(blogID)
    let autherID = deleteData.autherID
    let authodid = req.query.autherID

    if (!token) return res.send({ status: false, msg: "token must be present in the request header" })

    let decodedToken = jwt.verify(token, 'shubham-thorium')
    if (!decodedToken) return res.send({ status: false, msg: "token is not valid" })
    let decode = decodedToken.autherID
    if (authodid != decode) res.status(401).send({ status: false, msg: "anthentication denied" })

    let decoded = decodedToken.autherID
    if (autherID != decoded) res.status(403).send({ status: false, msg: "anthentication denied" })
    next()
  }
  catch (error) {
    console.log(error)
    res.status(500).send({ msg: error.message })
  }
}



module.exports.authenticate = authenticate;
module.exports.authorise = authorise;