const express = require('express')
const authenticate = require('../middlewares/authenticate')
const router = express.Router()
const User = require("../models/user")
const Book = require("../models/books")

router.post("/", authenticate , async (req , res)=>{
    try {
    const {title , author } = req.body
    const newBook = new Book({
      title,
      author,
      user: req.user.id,
      isApproved: false,
    })
    await newBook.save();
    res.status(201).send({
      message: "Book submitted for approval",
      data: newBook,
    });
  } catch (err) {
    res.status(500).send({ message: "Error creating book", error: err.message });
  }
})
module.exports = router;