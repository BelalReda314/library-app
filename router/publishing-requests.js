const express = require('express')
const Book = require('../models/books');
const router = express.Router()
const authenticateAdmin = require('../middlewares/authenticateAdmin');


router.get("/publishing-requests", authenticateAdmin, async (req, res) => {
  try {
    const pendingBooks = await Book.find({ isApproved: false }).populate("user", "name email");
    res.json(pendingBooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports= router;
