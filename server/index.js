const express = require('express')
require('dotenv').config()
require('./Models/db')
const cors = require('cors')
const bodyparser = require('body-parser')
const cookieParser = require('cookie-parser')
const router = require('./Routes/authroutes')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => res.send('Hello World!'))


app.use(cors({
    origin: "http://localhost:5173", // frontend
  credentials: true
}))
app.use(bodyparser.json())
app.use(cookieParser())
app.use('/api',router)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))