const express = require("express");
const router = express.Router();
const Book = require("../models/books");


router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.send({
      message: "Successfully retrieved books",
      code: 200,
      data: books,
    });
  } catch (err) {
    res.status(500).send({ message: "Error fetching books", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send({ message: "Book not found" });
    }
    res.send({ message: "success", data: book });
  } catch (err) {
    res.status(500).send({ message: "Error fetching book", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, author } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author },
      { new: true }
    );
    if (!book) {
      return res.status(404).send({ message: "Book not found" });
    }
    res.send({ message: "updated success", data: book });
  } catch (err) {
    res.status(500).send({ message: "Error updating book", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).send({ message: "Book not found" });
    }
    res.send({ message: "deleted success", data: book });
  } catch (err) {
    res.status(500).send({ message: "Error deleting book", error: err.message });
  }
});

module.exports = router;