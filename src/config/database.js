const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://devabinashshrestha:INtRl9KBXbb5GdGq@cluster1.ackf89a.mongodb.net/devTinder'
  );
};

module.exports = connectDB;
