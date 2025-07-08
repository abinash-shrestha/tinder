const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect('mongodb://localhost:27017/devTinder');
  // await mongoose.connect(
  //   'mongodb+srv://devabinashshrestha:Pccrusher13@cluster1.ackf89a.mongodb.net/devTinder'
  // );
};

module.exports = connectDB;
