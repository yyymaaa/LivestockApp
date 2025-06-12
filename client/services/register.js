const express = require('express');
const router = express.Router();
const db = require('./dbConnection');

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)';
  db.query(query, [username, email, password], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.status(201).json({ message: 'User registered successfully' });
  });
});

module.exports = router;
