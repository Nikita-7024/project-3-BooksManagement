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



const getBook = async function (req, res) {
    try {
        // filter data by query params and sorting by title----------------------------------------------
        let filter = req.query;
        if (Object.keys(filter).length === 0) {
            let book = await BookModel.find({ isDeleted: false })
            if (book.length === 0) {
                return res.status(404).send({ status: false, msg: "Books not found." })
            }
            let bookData = book.length;
            return res.status(200).send({ status: true, total: bookData, data: book })

        }
        // query params empty----------------
        if (filter.userId == undefined && filter.category == undefined && filter.subcategory == undefined) {
            let book = await BookModel.find({ isDeleted: false })
            if (!book) {
                return res.status(404).send({ status: false, msg: "Book not found." })
            }
            return res.status(200).send({ status: true, msg: "Success", data: book })
        }
        //    only userId in params----------
        if (filter.userId != undefined && filter.category == undefined && filter.subcategory == undefined) {
            let id = filter.userId

            let book = await BookModel.find({ $and: [{ userId: { $in: [id] } }, filter, { isDeleted: false }] }).sort({ "title": 1 }).select({
                _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1, subcategory: 1
            })
            if (book.length === 0) {
                return res.status(404).send({ status: false, msg: "Book not found with this uderId." })
            }
            return res.status(200).send({ status: true, mesg: "Success", data: book })
        }
        //  only category in params-----------
        if (filter.userId == undefined && filter.category != undefined && filter.subcategory == undefined) {
            let category = filter.category

            let book = await BookModel.find({ $and: [{ category: { $in: [category] } }, filter, { isDeleted: false }] }).sort({ "title": 1 }).select({
                _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1, subcategory: 1
            })
            if (book.length === 0) {
                return res.status(404).send({ status: false, msg: "Book not found with this category" })
            }
            return res.status(200).send({ status: true, mesg: "Success", data: book })
        }
        //   only subcategory in params ------------
        if (filter.userId == undefined && filter.category == undefined && filter.subcategory != undefined) {
            let subCat = filter.subcategory
            let book = await BookModel.find({ $and: [{ subcategory: { $in: [subCat] } }, filter, { isDeleted: false }] }).sort({ "title": 1 }).select({
                _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1, subcategory: 1
            })
            if (book.length === 0) {
                return res.status(404).send({ status: false, msg: "Book not found with this subcategory" })
            }
            return res.status(200).send({ status: true, mesg: "Success", data: book })
        }
        //  both category and subcategory in params----------
        if (filter.userId == undefined && filter.category != undefined && filter.subcategory != undefined) {
            let subCat = filter.subcategory
            let category = filter.category
            let book = await BookModel.find({ $and: [{ subcategory: { $in: [subCat] } }, { category: { $in: [category] } }, filter, { isDeleted: false }] }).sort({ "title": 1 }).select({
                _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1, subcategory: 1
            })
            if (book.length === 0) {
                return res.status(404).send({ status: false, msg: "Book not found with category and subcategory" })
            }
            return res.status(200).send({ status: true, mesg: "Success", data: book })
        }
        //   both userId and category in params---------
        if (filter.userId != undefined && filter.category != undefined && filter.subcategory == undefined) {

            let category = filter.category
            let id = filter.userId
            let book = await BookModel.find({ $and: [{ category: { $in: [category] } }, { userId: { $in: [id] } }, filter, { isDeleted: false }] }).sort({ "title": 1 }).select({
                _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1, subcategory: 1
            })
            if (book.length === 0) {
                return res.status(404).send({ status: false, msg: "Book not found with userId and category" })
            }
            return res.status(200).send({ status: true, mesg: "Success", data: book })
        }
        //  both userId and subcategory in params--------
        if (filter.userId != undefined && filter.category == undefined && filter.subcategory != undefined) {
            let subCat = filter.subcategory
            let id = filter.userId
            let book = await BookModel.find({ $and: [{ subcategory: { $in: [subCat] } }, { userId: { $in: [id] } }, filter, { isDeleted: false }] }).sort({ "title": 1 }).select({
                _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1, subcategory: 1
            })
            if (book.length === 0) {
                return res.status(404).send({ status: false, msg: "Book not found with userId and subcategory" })
            }
            return res.status(200).send({ status: true, mesg: "Success", data: book })
        }
        // all userId, category, subcategory in params----------
        if (filter.category != undefined && filter.subcategory != undefined && filter.userId != undefined) {
            let subCat = filter.subcategory
            let category = filter.category
            let id = filter.userId
            let book = await bookModel.find({ $and: [{ subcategory: { $in: [subCat] } }, { category: { $in: [category] } }, { userId: { $in: [id] } }, filter, { isDeleted: false }] }).sort({ "title": 1 }).select({
                _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1, subcategory: 1
            })
            if (book.length === 0) {
                return res.status(404).send({ status: false, msg: "Book not found with userId,category, subcategory" })
            }
            return res.status(200).send({ status: true, mesg: "Success", data: book })
        }

    } catch (error) {
        return res.status(500).send({ msg: "Error", error: error.message })
    }
}



const updateBook = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        let body = req.body;
        if (Object.keys(body).length === 0) {
            return res.status(400).send({ status: false, msg: "Enter Data to update." })
        }
        let validBook = await BookModel.findOne({ $and: [{ _id: bookId }, { isDeleted: false }] })
        if (!validBook) {
            return res.status(404).send({ status: false, msg: "Book not found" })
        }

        let updatedata = req.body;
        let updatedBook = await BookModel.findOneAndUpdate({ _id: bookId }, { title: updatedata.title, excerpt: updatedata.excerpt, releasedAt: updatedata.releasedAt, ISBN: updatedata.ISBN }, { new: true, upsert: true });
     
        return res.status(201).send({ status: true, message: "Success", data: updatedBook })

    } catch (err) {
        return res.status(500).send({ Error: err.message })
    }

}





const deleteBookById = async function (req, res) {
    try {
        let book = req.params.bookId;

        let validBook = await BookModel.findOneAndUpdate(
            { _id: book, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: Date.now() } },
            { new: true }
        )
        if (!validBook) {
            return res.status(404).send({ status: false, msg: "No such book exists" })
        }
        return res.status(200).send({ status: true, msg: "Book deleted" })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: "Error", error: error.message })
    }

}

module.exports.createBook = createBook
module.exports.getBook = getBook
module.exports.updateBook = updateBook
module.exports.deleteBookById = deleteBookById