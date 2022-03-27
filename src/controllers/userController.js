const userModel = require('../models/userModel')
let jwt = require('jsonwebtoken')

// define valid function---------------------
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const createUser = async function (req, res) {

    try {
        let data = req.body

        let { title, name, phone, email, password, address } = data  //destructuring method

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "BAD REQUEST" })

        }
        // validation start---------------

        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "title is required" })

        }
        if (!isValid(name)) {
            return res.status(400).send({ status: false, msg: "name is required" })

        }
        if (!isValid(address)) {
            if (!(address.street)) {
                return res.status(400).send({ status: false, msg: "street is required" })
            }
            if (!(address.city)) {
                return res.status(400).send({ status: false, msg: "city is required" })
            }
            if (!(address.pincode)) {
                return res.status(400).send({ status: false, msg: "pincode is required" })
            } else {

                return res.status(400).send({ status: false, msg: "address is required" })
            }

        }
        // validate phone------------------  
        if (!isValid(phone)) {
            return res.status(400).send({ status: false, msg: "phone is required" })
        }
        if (!(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(phone))) {
            res.status(400).send({ status: false, msg: "phone is not a valid number" })
            return
        }
        // validate email------------------
        if (!isValid(email)) {
            res.status(400).send({ status: false, msg: "email is required" })
            return
        }
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, msg: "email is not a valid email" })
            return
        }
        // valiate password---------------
        if (!isValid(password)) {
            res.status(400).send({ status: false, msg: "password is required" })
            return
        }
        if (!(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password))) {
            res.status(400).send({ status: false, msg: "password is not  valid" })
            return
        }


        let isemailAlreadyUsed = await userModel.findOne({ email })
        if (isemailAlreadyUsed) {
            res.status(400).send({ status: false, msg: "this email is already used, please provide another email" })
            return
        }

        let isPasswordAlreadyUsed = await userModel.findOne({ password })
        if (isPasswordAlreadyUsed) {
            res.status(400).send({ status: false, msg: "this password is already used, please provide another password" })
            return
        }
        let isPhoneAlreadyUsed = await userModel.findOne({ phone })
        if (isPhoneAlreadyUsed) {
            return res.status(400).send({ status: false, msg: "phone is already used, please provide another phone number" })
        }



        // create user-------------------
        let user = await userModel.create(data)

        res.status(201).send({ status: true, msg: "Success", data: user })


    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }

}



const loginUser = async function (req, res) {
    try {
        let userName = req.body.email;
        let password = req.body.password;
        if (!userName || !password) {
            return res.status(400).send({ status: false, msg: "email and password must be present" })
        }


        let user = await userModel.findOne({ email: userName, password: password });
        if (!user)
            return res.status(400).send({
                status: false,
                msg: "auther name or the password is not corerct",
            });

        let token = jwt.sign(
            { userID: user._id.toString() }, 'nikita singh'
        );
        res.setHeader("x-api-key", token);
        return res.status(201).send({ status: true, msg: "success", data: token });
    }
    catch (err) {

        return res.status(500).send({ msg: "Error", error: err.message })
    }
}





module.exports.createUser = createUser
module.exports.loginUser = loginUser

