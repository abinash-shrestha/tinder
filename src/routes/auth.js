const express = require('express');
const authRouter = express.Router();

const { validateSignUpData } = require('../utils/validation');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// add user
authRouter.post('/signup', async (req, res) => {
  const user = new User(req.body);

  try {
    //Data Validation
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt Password

    const passwordHash = await bcrypt.hash(password, 10);

    //creating a new instance of the User
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send('User added Successfully');
  } catch (err) {
    res.status(400).send('Error:' + err.message);
  }
});

// login
authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    // console.log(emailId + password);

    const user = await User.findOne({ emailId: emailId });
    // console.log(user);

    if (!user) {
      throw new Error('Invalid Credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    // console.log(isPasswordValid);

    if (isPasswordValid) {
      // JWT TOKEN
      const token = await jwt.sign({ _id: user._id }, 'devtinder1357', {
        expiresIn: '7d',
      });

      //SEND COOKIES
      res.cookie('token', token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send('Login Successful');
    } else {
      throw new Error('Invalid Credentials');
    }
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

module.exports = authRouter;
