const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Book = require("../models/books");
const User = require("../models/user.js");
const authValidate = require('../middlewares/authvalidate.js')
const authenticate = require('../middlewares/authenticate');
const authenticateAdmin = require('../middlewares/authenticateAdmin.js');

router.post('/register', authValidate, async (req, res) => {
  try {
    const { email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({ email, password: hashedPassword , role:"admin"});

    res.json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET);

  res.json({ message: "Login successful", token });
});



router.patch("/publishing-requests/:id/approve", authenticate, authenticateAdmin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    book.isApproved = true;
    await book.save();

    res.json({ message: "Book approved", data: book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/publishing-requests/:id/reject", authenticate, authenticateAdmin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book rejected and deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/all-books', authenticateAdmin, async (req, res) => {
  try {
    const books = await Book.find({}).populate("user", "email");
    if (!books || books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }

    res.json({ message: "All books", data: books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;