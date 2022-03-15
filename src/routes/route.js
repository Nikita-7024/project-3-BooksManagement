const express = require('express');
const router = express.Router();

const BlogController= require("../controllers/blogController")

const AutherController= require("../controllers/AutherController")

router.post("/auther",AutherController.createauther)

router.post("/blog",BlogController.createblog)

router.get("/getblogg",BlogController.getBlog)

router.put("/updateblogg/:blogID",BlogController.updateblog)

router.delete("/deleteblogg/:blogID",BlogController.deletebyId)

router.delete("/deletequery",BlogController.deletebyQuery)

module.exports = router;