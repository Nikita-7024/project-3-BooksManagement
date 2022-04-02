const express = require('express');
const router = express.Router();

const UserController= require("../controllers/userController")
const BookController= require("../controllers/bookController")
const ReviewController= require("../controllers/reviewController")
const Middleware=require("../middleware/auth")



// ------------------******** USER API'S *********--------------------------

// Creat user......
router.post("/register",UserController.createUser)
//Login auther....
router.post("/login",UserController.loginUser)


// ------------------******* BOOK API'S ************---------------------------------

// create Book.......
router.post("/books", Middleware.authentication, BookController.createBook)
// get book list.....
router.get("/books",  Middleware.authentication, BookController.getBook)
// get book by id.......
router.get("/books/:bookId", Middleware.authentication,BookController.getBooksById)
// update Book data by Id.....
router.put("/books/:bookId", Middleware.authentication, BookController.updateBook)
// delete book by id....
router.delete("/books/:bookId", Middleware.authentication, BookController.deleteBookById )


// -------------------******* REVIEW API'S ********-----------------------------

// create review.....
router.post("/books/:bookId/review", ReviewController.review)
// update review data......
router.put("/books/:bookId/review/:reviewId", ReviewController.updateReview)
// delete review data By id.....
router.delete("/books/:bookId/review/:reviewId", ReviewController.deleteReviewById)



module.exports = router;