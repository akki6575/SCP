// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // MongoDB User model
const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({ email, password: hashedPassword });
    await user.save();

    // Return success message
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error in signup', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
