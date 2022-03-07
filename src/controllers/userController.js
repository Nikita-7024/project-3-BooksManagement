const User1Model= require("../models/userModel")

const createUser= async function (req, res) {
    let data= req.body
    let savedData= await User1Model.create(data)
    console.log(req.newAtribute)
    res.send({msg: savedData})
}

const getUsersData= async function (req, res) {
    

    let allUsers= await User1Model.find()
    console.log(req.newAtribute)
    res.send({msg: allUsers})
}

module.exports.createUser= createUser
module.exports.getUsersData= getUsersData