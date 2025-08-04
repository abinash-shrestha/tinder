const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequestSchema');
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
module.exports = userRouter;
