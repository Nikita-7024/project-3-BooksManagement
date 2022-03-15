const mongoose = require('mongoose');
const validator = require('validator');
const autherSchema = new mongoose.Schema({

        firstName: { type: String, require: true },

        lastName: { type: String, require: true },

        title: { type: String, require: true, enum: ["Mr", "Mrs", "Miss"] },

        email:{
                type:String,
                validate:{
                      validator: validator.isEmail,
                      message: '{VALUE} is not a valid email',
                      isAsync: false
                    }
                },

        password: { type: String, require: true }

}, { timestamps: true });


module.exports = mongoose.model('Auther', autherSchema) 
