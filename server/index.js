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
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// 🔥 REQUIRED FOR PREFLIGHT
app.options('*', cors());

app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', router);

module.exports = app;
