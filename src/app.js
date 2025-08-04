require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

connectDB()
  .then(() => {
    console.log('Database connection established');
    app.listen(process.env.PORT, () => {
      console.log('Listening on port: ' + process.env.PORT);
    });
  })
  .catch(() => {
    console.log('Database connection failed');
  });
