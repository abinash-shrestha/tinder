const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    requestStatus: {
      type: String,
      enum: {
        values: ['accepted', 'rejected', 'ignored', 'interested'],
        message: `{values} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

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
