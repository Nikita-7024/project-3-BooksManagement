const mongoose = require('mongoose')
const ReviewModel = require('../models/reviewModel');
const BookModel = require("../models/bookModel");

const { isValidObjectId } = require("../isValid/valid.js")

const review = async function (req, res) {
    try {
        if (Object.keys(req.query).length > 0) {
            return res.status(400).send({ status: false, message: "please don't provide params " })
        }

        let bookid = req.params.bookId;
        if (!isValidObjectId(bookid)) { return res.status(400).send({ status: false, msg: " bookId is invalid" }) };

        let bookPresent = await BookModel.findById(bookid);
        if (!bookPresent) { return res.status(404).send({ status: false, msg: "This bookId Is Not Present" }) };

        let data = req.body;

        let { bookId, rating, reviewedBy } = data

        // if (Object.keys(reviewedBy).length == 0)
        //     return res.status(400).send({ status: false, msg: " ReviewedBy should be present" });

        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, msg: "PLEASE FILL THE BODY" });

        if (!bookId) return res.status(400).send({ status: false, msg: "Where is the bookId ?" });

        let bookidPresent = await BookModel.findById(bookId)
        if (!bookidPresent) {
            return res.status(404).send({ status: false, msg: "Sorry This bookId Is Not Present" })
        };

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
        console.log(updateReview)
        // CREATING REVIEW WITH THE HELP OF DATA IN THE REQUEST BODY:
        let CreateReview = await ReviewModel.create(data)
        res.status(201).send({ status: true, message: "success",  data: CreateReview });
    } catch (err) {
        res.status(500).send({ status: false, Error: err.message });
    }
}


const updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        let body = req.body;
        if (Object.keys(body).length === 0) {
            return res.status(400).send({ status: false, msg: "Enter Data to update." })
        }
        if (Object.keys(req.query).length > 0) {
            return res.status(400).send({ status: false, message: "please don't provide value on params " })
        }
        if (!isValidObjectId(bookId)) {
            res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
            return
        }
        if (!isValidObjectId(reviewId)) {
            res.status(400).send({ status: false, message: `${reviewId} is not a valid review id` })
            return
        }
        let validBook = await BookModel.findOne({ $and: [{ _id: bookId }, { isDeleted: false }] })
        if (!validBook) {
            return res.status(404).send({ status: false, msg: "Book not found with this book Id" })
        }
        let validReview = await ReviewModel.findOne({ $and: [{ _id: reviewId }, { isDeleted: false }] })
        if (!validReview) {
            return res.status(404).send({ status: false, msg: "review not found with thhis review id" })
        }

        const { rating, reviewedBy } = body;
        if (!rating) {
            return res.status(400).send({ status: false, msg: "rating is required, please fill the rating " })
        }
        if (rating < 1)
            return res.status(400).send({ status: false, msg: " Rating must be greater than 1" });
        if (rating > 5)
            return res.status(400).send({ status: false, msg: " Rating must be less than 5" });

        // if (!reviewedBy) {
        //     return res.status(400).send({ status: false, msg: "reviewedBy is required " })
        // }


        let updatedata = req.body;
        let updatedReview = await ReviewModel.findOneAndUpdate({ _id: reviewId }, { rating: updatedata.rating, reviewedBy: updatedata.reviewedBy, review: updatedata.review }, { new: true, upsert: true });

        return res.status(200).send({ status: true, message: "Success", data: updatedReview })

    } catch (err) {
        return res.status(500).send({ Error: err.message })
    }

}


const deleteReviewById = async function (req, res) {
    try {
        let book = req.params.bookId;
        let review = req.params.reviewId;

        if (!isValidObjectId(book)) {
            res.status(400).send({ status: false, message: `${book} is not a valid book id` })
            return
        }
        
        if (!isValidObjectId(review)) {
            res.status(400).send({ status: false, message: `${review} is not a valid review id` })
            return
        }
        if (Object.keys(req.query).length > 0) {
            return res.status(400).send({ status: false, message: "please don't provide value on params " })
        }

        let validReview = await ReviewModel.findOneAndUpdate(
            { _id: review, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: Date.now() } },
            { new: true }
        )
        if (!validReview) {
            return res.status(404).send({ status: false, msg: "No such review exists" })
        }

        return res.status(200).send({ status: true, msg: "Review deleted" })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: "Error", error: error.message })
    }

}



module.exports.review = review
module.exports.updateReview = updateReview
module.exports.deleteReviewById = deleteReviewById