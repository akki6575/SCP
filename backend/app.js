// backend/app.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Initialize SQLite database
const db = new sqlite3.Database('database.sqlite');

// Create users table if it doesn't exist
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)');
});

// Sign Up Route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (row) {
      return res.status(400).json({ error: 'User already exists' });
    }

    try {
      // Hash password and save user
      const hashedPassword = await bcrypt.hash(password, 10);
      db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to sign up' });
        }
        res.status(201).json({ success: true });
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to sign up' });
    }
  });
});

// Login Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err || !row) {
      return res.status(401).send('User not found');
    }

    const isMatch = bcrypt.compareSync(password, row.password);
    if (!isMatch) {
      return res.status(401).send('Invalid password');
    }

    const token = jwt.sign({ id: row.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Package Damage Detection Route with file upload
app.post('/detect-damage', upload.single('image'), (req, res) => {
  const imagePath = req.file.path;

  // Run YOLO detection
  exec(`python3 detect_damage.py ${imagePath}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send('Error processing image');
    }

    const outputImagePath = stdout.trim();
    res.send({ message: 'Image processed successfully', imagePath: outputImagePath });
  });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000/');
});
