const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();

app.use(express.json());

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

app.post('/signup', async (req, res) => {
  // console.log(req.body);

  // const user = new User(req.body);

  try {
    await user.save();
    res.send('User added Succesfully');
  } catch {
    res.status(500).send('Error:' + err.message);
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
