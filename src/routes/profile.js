const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');

//get profile data
profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

//update profile data
profileRouter.patch('./profile/edit', userAuth, async (req, res) => {
  try {
    if (validateEditProfileData(req)) {
      throw new Error('Invalid Edit Request');
    }

    const loggedInUser = req.user;
    console.log(loggedInUser);
  } catch (err) {
    res.status(400).send('ERROR :' + err.message);
  }
});

module.exports = profileRouter;
