const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // reference to User Collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requestStatus: {
      type: String,
      enum: {
        values: ['accepted', 'rejected', 'ignored', 'interested'],
        message: `{value} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1, toUSerId: 1 });

connectionRequestSchema.pre('save', function (next) {
  const ConnectionRequest = this;

  if (ConnectionRequest.fromUserId.equals(this.toUserId)) {
    throw new Error('Cannot send connection request to yourself');
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  'ConnectionRequest',
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
