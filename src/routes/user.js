const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequestSchema');
const User = require('../models/user');
const userRouter = express.Router();

const USER_SAFE_DATA = 'firstName lastName age gender skills about photoUrl';

userRouter.get('/user/request/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      requestStatus: 'interested',
    }).populate(
      'fromUserId',
      'firstName lastName age photoUrl skills gender about'
    );
    // }).populate('fromUserId', ['firstName', 'lastName', 'photoUrl', 'age']);

    res.json({
      message: 'Data fetched Successfully',
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).json({
      message: 'Error:' + err.message,
    });
  }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, requestStatus: 'accepted' },
        { toUserId: loggedInUser._id, requestStatus: 'accepted' },
      ],
    })
      .populate('fromUserId', USER_SAFE_DATA)
      .populate('toUserId', USER_SAFE_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.json({ data: data });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

userRouter.get('/user/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select('fromUserId toUserId');

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA);
    res.send(users);
  } catch (err) {
    res.status(400).send('ERROR: ' + err.message);
  }
});
module.exports = userRouter;
