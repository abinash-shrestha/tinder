const express = require('express');
const { userAuth } = require('../middlewares/auth');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequestSchema');
const User = require('../models/user');

requestRouter.post(
  '/request/send/:status/:toUserId',
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const requestStatus = req.params.status;

      const allowedStatus = ['interested', 'ignored'];

      if (!allowedStatus.includes(requestStatus)) {
        return res
          .status(400)
          .send(`${requestStatus} is a invalid request status`);
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(400).json({ message: 'User not found' });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUser },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: 'Connection Request Already Exists' });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        requestStatus,
      });

      const data = await connectionRequest.save();

      const action =
        requestStatus === 'interested' ? `is interested in` : `ignored`;

      res.json({
        message: `${req.user.firstName} ${action} ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send('ERROR: ' + err.message);
    }
  }
);

requestRouter.post(
  '/request/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const requestStatus = req.params.status;
      const requestId = req.params.requestId;

      const allowedStatus = ['accepted', 'rejected'];

      if (!allowedStatus.includes(requestStatus)) {
        return res.status(400).json({
          message: `${requestStatus} is invalid status `,
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        requestStatus: 'interested',
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: 'Connection Request not found' });
      }

      connectionRequest.requestStatus = requestStatus;
      const data = await connectionRequest.save();

      res.json({ message: 'Connection Request ' + requestStatus, data });
    } catch (err) {
      res.send('Error: ' + err.message);
    }
  }
);

module.exports = requestRouter;
