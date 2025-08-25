const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User" , require: true},
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  isBorrowed: { type: Boolean, default: false },
  history: {
    borrowed_from: Date,
    borrowed_to: Date,
    borrowed_by: String,
  },
}, { timestamps: true });

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
