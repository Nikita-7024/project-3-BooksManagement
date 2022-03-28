const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
        title: {
                type: String,
                trim:true,
                required: true, 
                enum: ["Mr", "Mrs", "Miss"] 
        },
        name: {
                type: String,
                trim:true, 
                required: true 
        },
        phone: {
                type: String, 
                trim:true,
                match: [/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/, 'Please fill a valid mobile number'],
                required:true,
                unique: true 
        },
        email: {
                type: String,
                trim: true,
                unique: true,
                match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
                lowercase: true,
                required: true
        },
        password: {
                type: String,
                trim: true, 
                minLength: 8, 
                maxLength: 15,
                match: [/^[a-zA-Z0-9!@#$%^&*]{8,15}$/, 'Please fill a valid password'],
                required: true
        },
        address: {
                street: {type: String },
                city: {type: String},
                pincode: {type: String }
        },  

}, { timestamps: true });
        
        


module.exports = mongoose.model('User', userSchema) ;
