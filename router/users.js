const express = require("express");
const User = require("../models/user");
const Book = require('../models/books');
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      message: "users retrieved success",
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      message: "error retrieving users",
      error: err.message,
    });
  }
});

router.get('/my-books', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const books = await Book.find({ user: userId });
    if (!books || books.length === 0) {
      return res.status(404).json({ message: "No books found for this user" });
    }

    res.json({ message: "Your books", data: books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
