const express = require('express');
require('dotenv').config();
require('./Models/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = require('./Routes/authroutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', router);

// 🔥 THIS LINE WAS MISSING
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
