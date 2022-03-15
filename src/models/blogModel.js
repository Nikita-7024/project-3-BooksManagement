const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const blogSchema = new mongoose.Schema({

    title: {
        type: String,

        require: true
    },
    body: {
        type: String,

        require: true
    },
    autherID: { type: ObjectId, ref: "Auther", require: true },

    tags: [String],
    category: { type: String, require: true, },
    subcategory:[String],
    ispublished: { type: Boolean, default: false },
    publishedAt: {
        type: Date,
        default: Date.now()
    },
    isdeleted: { type: Boolean, default: false },
    deletedAt: {
        type: Date,
        default: Date.now()
    }


}, { timestamps: true });

module.exports = mongoose.model('Blog1', blogSchema) //users



// String, Number
// Boolean, Object/json, array