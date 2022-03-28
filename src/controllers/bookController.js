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
        let x = req.query
        if (Object.keys(x).length > 0) {
            return res.status(400).send({ status: false, message: "please don't provide params " })
        }

        let data = req.body

        let { title, excerpt, ISBN, userId, category, subcategory, releasedAt } = data

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
        if (!isValid(excerpt)) {
            res.status(400).send({ status: false, msg: "excerpt is required" })
            return
        }
        if (!isValid(ISBN)) {
            res.status(400).send({ status: false, msg: "ISBN is required" })
            return
        }
        let isISBNAlreadyUsed = await BookModel.findOne({ ISBN })
        if (isISBNAlreadyUsed) {
            res.status(400).send({ status: false, msg: "this ISBN is already used, please provide another" })
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
        if (!isValid(releasedAt)) {
            res.status(400).send({ status: false, msg: "releasedAt date is required" })
            return
        }
        if (!(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(releasedAt))) {
            res.status(400).send({ status: false, msg: "releasedAt date is not a valid date" })
            return
        }

        let user = data.userId
        let userValid = await UserModel.findById({ _id: user })
        if (!userValid) {
            return res.status(404).send({ status: false, msg: "userId doesn't exist" })
        }
        else {

            let bookCreated = await BookModel.create(data)
            return res.status(201).send({ status: true, msg: "Success", data: bookCreated })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ msg: error.message })
    }
}



const listBook = async function (req, res) {

    try {
        const isValidRequestBody = function (requestBody) {
            return Object.keys(requestBody).length > 0
        }

        const filterQuery = { isDeleted: false, deletedAt: null }
        const queryParams = req.query

        if (isValidRequestBody(queryParams)) {
            const { title, excerpt, userId, category, releasedAt, reviews } = queryParams

            if (isValid(userId) && isValidObjectId(userId)) {
                filterQuery['userId'] = userId
            }
            if (isValid(title)) {
                filterQuery['title'] = title.trim()
            }
            if (isValid(excerpt)) {
                filterQuery['excerpt'] = excerpt.trim()
            }
            if (isValid(category)) {
                filterQuery['category'] = category.trim()
            }
            if (isValid(releasedAt)) {
                filterQuery['releasedAt'] = reviews.trim()
            }
            if (isValid(reviews)) {
                filterQuery['reviews'] = releasedAt.trim()
            }


        }

        const book = await BookModel.find(queryParams)
        if (!book) {
            return res.status(400).send({ status: false, message: 'Book not found' })
        }
        else {
            return res.status(200).send({ status: true, message: 'Book List', data: book })
        }


    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: "failed", message: err.message })
    }

}

module.exports.createBook = createBook
module.exports.listBook = listBook