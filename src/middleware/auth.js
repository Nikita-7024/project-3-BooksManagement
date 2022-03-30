const jwt = require("jsonwebtoken");
const BookModel = require('../models/bookModel')


const authenticationUser = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

    let decodedToken = jwt.verify(token, "nikita singh");          //verifying token with secret key

    if (!decodedToken)
      return res.status(400).send({ status: false, msg: "token is invalid" });      //validating token value inside decodedToken

    next();

  }
  catch (error) {
    res.send({ msg: error.message })
  }
}


const authorisationUser = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];

    const decodedToken = jwt.verify(token, "nikita singh");

    let authorisedUser = decodedToken.userID;
    let bookId = req.params.bookId;
    let bookById = await BookModel.findOne({ _id: bookId, isDeleted: false }).select({ userId: 1 })

    if (authorisedUser !== bookById.userId.toString()) {
      return res.status(401).send({ status: false, msg: "You are not an authorized person to make these changes" })
    }
    next();
  }
  catch (error) {
    return res.send({ msg: error.message })
  }
}


module.exports.authenticationUser = authenticationUser;

module.exports.authorisationUser = authorisationUser;