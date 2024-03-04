const mongoose = require("mongoose");
const Redis = require("ioredis");
require("dotenv").config();

// MongoDB connection
const mongoConnection = mongoose.connect(process.env.MONGO_URL);


module.exports = { mongoConnection };
