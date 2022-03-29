const ReviewModel = require('../models/reviewModel');
const BookModel = require("../models/bookModel");
const mongoose = require('mongoose')
const { isValidObjectId } = require("../isValid/valid.js")

const review = async function (req, res) {
    try {
        let bookid = req.params.bookId;
        if (!isValidObjectId(bookid))
         { return res.status(400).send({ status: false, msg: "sorry the bookId is invalid" }) };
       
         let bookPresent = await BookModel.findById(bookid);
        if (!bookPresent) 
        { return res.status(400).send({ status: false, msg: "Sorry This bookId Is Not Present" }) };
       
        let data = req.body;
        let { bookId, rating } = data
        if (Object.keys(data).length == 0)
         return res.status(400).send({ status: false, msg: "PLEASE FILL THE BODY" });

        // VALIDATING BOOKID:
        if (!bookId) return res.status(400).send({ status: false, msg: "Where is the bookId ?" });
        let bookidPresent = await BookModel.findById(bookId)
        if (!bookidPresent) { return res.status(400).send({ status: false, msg: "Sorry This bookId Is Not Present" }) };
        // VALIDATING RATING:

        if (!rating) 
        return res.status(400).send({ status: false, msg: "Where is the rating ?" });
        if (rating < 1) 
        return res.status(400).send({ status: false, msg: " Rating must be greater than 1" });
        if (rating > 5)
         return res.status(400).send({ status: false, msg: " Rating must be less than 5" });
        // VALIDATING REVIEWEDAT:

        data.reviewedAt = Date.now();
        //  UPDATING THE REVIEW OF THE BOOK:
        let updateReview = await BookModel.findByIdAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } }, { new: true });
        // CREATING REVIEW WITH THE HELP OF DATA IN THE REQUEST BODY:
        let CreateReview = await ReviewModel.create(data)
        res.status(201).send({ status: true, data: CreateReview });
    } catch (err) {
        res.status(500).send({ status: false, Error: err.message });
    }
}


module.exports.review=review