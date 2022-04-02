const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel.js")

const authentication = async  function (req, res, next) {
    try {
        const token = req.headers['x-api-key']
        if (!token)
            return res.status(403).send({ status: false, msg: "Missing authentication token request" })

       const decodedToken = jwt.verify(token, 'nikita singh')
       if (!decodedToken){
           res.status(403).send({status:false,msg:"invalid authentication request"})
           return
       }
       req.userId = decodedToken.userId;
       next()
    }catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}



module.exports.authentication=authentication