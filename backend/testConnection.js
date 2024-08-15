// testConnection.js
const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB connected successfully');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err);
  });
