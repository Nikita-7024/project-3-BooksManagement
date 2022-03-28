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
router.get("/book/get",BookController.getBook)


// update Book by Id.....
router.post("/update/books/:bookId",BookController.updateBook)


// delete book by id....
router.delete("/delete/books/:bookId",BookController.deleteBookById )





module.exports = router;