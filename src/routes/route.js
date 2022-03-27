const express = require('express');
const router = express.Router();

const UserController= require("../controllers/userController")



// Creat user......
router.post("/user/register",UserController.createUser)

//Login auther....
router.post("/user/login",UserController.loginUser)


module.exports = router;