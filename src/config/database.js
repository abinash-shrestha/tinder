const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(process.env.DB_CLOUD_URL);
};

module.exports = connectDB;
