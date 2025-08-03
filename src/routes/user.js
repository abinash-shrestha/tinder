const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequestSchema');
const userRouter = express.Router();

userRouter.get('/request/receive', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel({
      toUserId: loggedInUser._id,
      requestStatus: 'interested',
    });
  } catch (err) {
    res.status(400).json({
      message: 'Error:' + err.message,
    });
  }
});

module.exports = userRouter;
