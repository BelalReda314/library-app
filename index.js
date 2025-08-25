const express = require('express');
const bodyParser = require('body-parser');
const bookRouter = require('./router/books')
const addbookRouter = require('./router/addNewBook');
const userRouter = require('./router/users');
const authRouter = require('./router/auth');
const borrowRouter = require('./router/borrow');
const publishingRouter = require('./router/publishing-requests')
const adminRouter = require('./router/admin')
const dbConnect = require('./config/database');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());
dbConnect(process.env.DB_URI);

app.use('/books',bookRouter);
app.use('/addbook',addbookRouter);
app.use('/auth',authRouter);
app.use('/users' , userRouter);
app.use('/borrow' , borrowRouter);
app.use('/admin' , publishingRouter);
app.use('/admin' , adminRouter);


app.get("/", (req, res) => {
  res.json({ message: "🚀 Server running on Vercel" });
});
module.exports = app;