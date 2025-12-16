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
  origin: "https://edu-lens-vxgv.vercel.app",
  credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', router);

// 🔥 THIS LINE WAS MISSING
module.exports = app;
