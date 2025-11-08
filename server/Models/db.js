let mongoose = require('mongoose');
require('dotenv').config();
const dbURI = process.env.MONGO_CONN;

mongoose.connect(dbURI)
.then(() => {
    console.log("Mongo connected");
    
}).catch((err) => {
    console.log(err);
});

module.exports = mongoose