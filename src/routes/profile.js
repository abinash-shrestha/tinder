const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const {
  validateEditProfileData,
  validatePasswordChangeData,
} = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const validator = require('validator');

//view profile data
profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;
    // res.send(user);
    res.json({
      message: `Hello ${user.firstName}, Here is your profile data`,
      data: user,
    });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

//update profile data
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error('Invalid Edit Request');
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile is updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send('ERROR :' + err.message);
  }
});

// Password Change
profileRouter.patch('/profile/changepassword', userAuth, async (req, res) => {
  try {
    const { emailId, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ emailId: emailId });

    await validatePasswordChangeData(user, oldPassword, newPassword);

    const passwordHash = await bcrypt.hash(newPassword, 10);

    user.password = passwordHash;
    await user.save();

    res.send('Password Changed Succesfully');
  } catch (err) {
    res.send('Error: ' + err.message);
  }
});

module.exports = profileRouter;
