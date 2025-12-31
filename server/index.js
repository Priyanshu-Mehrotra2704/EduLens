const express = require('express')
require('dotenv').config()
require('./Models/db')
const cors = require('cors')
const bodyparser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const fs = require('fs')
const authRouter = require('./Routes/authroutes')
const teacherRouter = require('./Routes/teacherRoutes')
const studentRouter = require('./Routes/studentRoutes')
const adminRouter = require('./Routes/adminRoutes')
const app = express()
const port = process.env.PORT || 3000

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'notes')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

app.get('/', (req, res) => res.send('Hello World!'))


// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(cookieParser())

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', authRouter)
app.use('/api/teacher', teacherRouter)
app.use('/api/student', studentRouter)
app.use('/api/admin', adminRouter)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(port, () => console.log(`Server listening on port ${port}!`))