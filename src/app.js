const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');

app.use(express.json());

// add user
app.post('/signup', async (req, res) => {
  const user = new User(req.body);

  try {
    //Data Validation
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt Password

    const passwordHash = await bcrypt.hash(password, 10);

    //creating a new instance of the User
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send('User added Successfully');
  } catch (err) {
    res.status(400).send('Error:' + err.message);
  }
});

// get user by email
app.get('/user', async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.findOne({ emailId: userEmail });
    if (users.length === 0) {
      res.status(400).send('User not found');
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send('Something went wrong');
  }
});

// get all the user

app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(400).send('User not found');
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send('Something went wrong');
  }
});

// delete user

app.delete('/user', async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    // const user = await User.findByIdAndDelete(userId);

    res.send('User deleted successfully');
  } catch (err) {
    res.status(400).send('Something went wrong');
  }
});

// update user data
app.patch('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  // console.log(userId);
  try {
    const allowedUpdates = ['skills', 'photoUrl', 'about', 'age', 'gender'];

    isUpdateAllowed = Object.keys(data).every((k) =>
      allowedUpdates.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error('Update not allowed');
    }

    if (data?.skills.length > 10) {
      throw new Error('Cannot add more than 10 skills');
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: 'after',
      runValidators: true,
    });
    console.log(user);
    res.send('User updated successfully');
  } catch (err) {
    res.status(400).send('Something went wrong' + err.message);
  }
});

connectDB()
  .then(() => {
    console.log('Database connection established');
    app.listen(3000, () => {
      console.log('Listening on port 3000.....');
    });
  })
  .catch(() => {
    console.log('Database connection failed');
  });
