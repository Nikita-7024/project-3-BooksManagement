const express = require('express');
const router = express.Router();

const UserController= require("../controllers/userController")
const BookController= require("../controllers/bookController")



// Creat user......
router.post("/user/register",UserController.createUser)

//Login auther....
router.post("/user/login",UserController.loginUser)

// create Book.......
router.post("/book/create",BookController.createBook)

// get book list.....
router.get("/book/get",BookController.listBook)

module.exports = router;