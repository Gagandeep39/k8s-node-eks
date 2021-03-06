const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const taskRoutes = require('./routes/task-routes');
const verifyUser = require('./middleware/user-auth');

const app = express();
const CONNECTION_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}:27017/?authSource=admin`;

app.use(bodyParser.json());
app.use(cors());

app.use(verifyUser, taskRoutes);

app.use((err, req, res, next) => {
  let code = 500;
  let message = 'Something went wrong.';
  if (err.code) {
    code = err.code;
  }

  if (err.message) {
    message = err.message;
  }
  res.status(code).json({ message: message });
});

mongoose.connect(
  CONNECTION_URI,
  { useNewUrlParser: true },
  (err) => {
    if (err) {
      console.log(err);
      console.log('COULD NOT CONNECT TO MONGODB!');
    } else {
      app.listen(3000, () => console.log('Server Started with Port 3000'));
    }
  }
);
