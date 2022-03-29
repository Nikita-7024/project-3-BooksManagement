const express = require('express');
const router = express.Router();

const UserController= require("../controllers/userController")
const BookController= require("../controllers/bookController")
const ReviewController= require("../controllers/reviewController")




// Creat user......
router.post("/user/register",UserController.createUser)

//Login auther....
router.post("/user/login",UserController.loginUser)

// create Book.......
router.post("/book/create",BookController.createBook)


// get book list.....
router.get("/book/get",BookController.getBook)


// update Book by Id.....
router.put("/books/:bookId",BookController.updateBook)


// delete book by id....
router.delete("/books/:bookId",BookController.deleteBookById )


// get book by id.......
router.get("/books/:bookId", BookController.getBooksById)


// create review.....
router.post("/books/:bookId/review", ReviewController.review)





module.exports = router;