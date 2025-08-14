const validator = require('validator');
const bcrypt = require('bcrypt');

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error('Name is not valid');
  } else if (!validator.isEmail(emailId)) {
    throw new Error('Email is not valid');
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('Password is not strong enough');
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    'firstName',
    'lastName',
    'age',
    'photoUrl',
    'gender',
    'skills',
    'about',
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

const validatePasswordChangeData = async (user, oldPassword, newPassword) => {
  if (!user) {
    throw new Error('Invalid Credentials');
  }

  if (oldPassword === '' || newPassword === '') {
    throw new Error('Please fill out both password');
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new Error('Incorrect Old Password');
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error(
      'New Password is not strong enough, Password must have minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1'
    );
  }

  if (oldPassword === newPassword) {
    throw new Error('New password can not be same as old password');
  }
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validatePasswordChangeData,
};
