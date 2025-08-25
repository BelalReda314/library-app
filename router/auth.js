const express = require("express");
const User = require("../models/user.js");
const authValidate = require("../middlewares/authvalidate.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();


authRouter.post('/login', authValidate, async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const existUser = await User.findOne({ email });
    if (!existUser) {
      return res.status(404).send({ message: 'Email not found' });
    }

  
    const hashedPasswordCheck = bcrypt.compareSync(password, existUser.password);
    if (!hashedPasswordCheck) {
      return res.status(404).send({ message: 'Password is incorrect' });
    }

  
    const token = jwt.sign(
      { email: existUser.email, id: existUser._id },
      process.env.JWT_SECRET);

    res.json({
      message: 'Logged in successfully',
      token,
      user: existUser,
    });
  } catch (err) {
    res.status(500).send({ message: 'Server error', error: err.message });
  }
});




authRouter.post('/register', authValidate, async (req, res) => {
  try {
    const { email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).send({ message: 'Email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({ email, password: hashedPassword });

    res.send({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (err) {
    res.status(500).send({ message: 'Server error', error: err.message });
  }
});


module.exports = authRouter;
