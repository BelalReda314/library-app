const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const Book = require("../models/books");
const User = require("../models/user");

router.post("/:id/borrow", authenticate, async (req, res) => {
  try {
    const bookId = req.params.id;
    const { borrowed_from, borrowed_to } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).send({ message: "book not found" });
    if (book.isBorrowed)
      return res.status(400).send({ message: "book already borrowed" });

    const user = await User.findById(req.user.id); 

    if (!user) return res.status(404).send({ message: "user not found" });


    book.isBorrowed = true;
    book.history = {
      borrowed_from,
      borrowed_to,
      borrowed_by: user.email,
    };
    await book.save();


    user.books.push({
      id: book._id,
      title: book.title,
      price: book.price,
      borrowed_from: new Date(),
      borrowed_to,
    });
    await user.save();

    res.send({
      message: "book borrowed successfully",
      book,
      user,
    });
  } catch (err) {
    res
      .status(500)
      .send({ message: "error borrowing book", error: err.message });
  }
});

router.get("/my/borrowed", authenticate, async (req, res) => {
  try {

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Your borrowed books",
      code: 200,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        books: user.books,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching borrowed books",
      error: err.message,
    });
  }
});




router.post("/:id/return", authenticate, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send({ message: "book not found" });
    if (!book.isBorrowed) return res.status(400).send({ message: "book is not borrowed" });

    const user = await User.findById(req.user.id);
    if (book.history.borrowed_by !== user.email) {
      return res.status(403).send({ message: "you did not borrow this book" });
    }

 
    book.isBorrowed = false;
    book.history.borrowed_to = new Date();
    await book.save();

  
    user.books = user.books.filter(b => b.title !== book.title);
    await user.save();

    res.send({
      message: "book returned successfully",
      book,
      user,
    });
  } catch (err) {
    res.status(500).send({ message: "error returning book", error: err.message });
  }
});

module.exports = router;
