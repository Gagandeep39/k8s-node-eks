const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth-routes');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(authRoutes);

app.use((err, req, res, next) => {
  console.log(err);
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

app.listen(3000);
