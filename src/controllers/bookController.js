const BookModel = require('../models/bookModel')
const UserModel = require('../models/userModel')
const mongoose = require("mongoose")


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


const createBook = async function (req, res) {
    try {
        let data = req.body

        let { title, excert, ISBN, userId, category, subcategory, releasedAt} = data

        if (Object.keys(data).length == 0) {
            res.status(400).send({ status: false, msg: "Please provide Data" })
            return
        }

        if (!isValid(title)) {
            res.status(400).send({ status: false, msg: "title is required" })
            return
        }
        if (!isValid(category)) {
            res.status(400).send({ status: false, msg: "category is required" })
            return
        }
        if (!isValid(subcategory)) {
            res.status(400).send({ status: false, msg: "subcategory is required" })
            return
        }
        if (!isValid(excert)) {
            res.status(400).send({ status: false, msg: "excert is required" })
            return
        }
        if (!isValid(userId)) {
            res.status(400).send({ status: false, msg: "userId is required" })
            return
        }
        if (!isValidObjectId(userId)) {
            res.status(400).send({ status: false, msg: "userId is not a valid objectId" })
            return
        }

        let collegeDetails = await CollegeModel.findOne({name: collegeName})
        if (!collegeDetails) {
            return res.status(404).send({ status: false, msg: "collgename doesn't exist" })
        }
        else {
            let internToBeCreated = {name, email, mobile, collegeId: collegeDetails._id}
            let  internCreated = await internModel.create(internToBeCreated)
            res.status(201).send({ status: true, data: internCreated })

        }

    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}

module.exports.createBook = createBook