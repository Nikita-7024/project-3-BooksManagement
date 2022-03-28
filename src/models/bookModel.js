const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    excerpt: {
        type: String,
        trim: true,
        required: true
    },
    userId: {
        type: ObjectId,
        required: true,
        trim: true,
        ref: "User"
    },
    ISBN: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    subcategory: {
        type: String,
        required: true,
        trim: true
    },
    reviews: {
        type: Number,
        default: 0,
        trim: true,
        comment: "Holds number of reviews of this book "
    },
    deletedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
        required: true,
        match: [/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/, 'Please fill valid Date']
    }

}, { timestamps: true });



module.exports = mongoose.model('Book', bookSchema);