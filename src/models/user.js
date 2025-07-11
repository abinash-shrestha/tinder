const mongoose = require('mongoose');
// const { Schema } = mongoose;
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: 'true',
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: 'true',
    },
    emailId: {
      type: String,
      required: 'true',
      unique: 'true',
      lowercase: 'true',
      trim: 'true',
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid Email: ' + value);
        }
      },
    },
    password: {
      type: String,
      required: 'true',
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error('Weak Password: ' + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!['male', 'female', 'others'].includes(value)) {
          throw new Error('Gender is not valid');
        }
      },
    },
    photoUrl: {
      type: String,
    },
    about: {
      type: String,
      default: 'This is a default description of the user',
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
