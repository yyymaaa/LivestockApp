const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const generateToken = require('../utilities/generateJWT');
const { insertUser, findUserByEmail } = require('../models/userModel');



exports.checkUsernameAvailability = async (req, res) => {
  const { username } = req.params;

  try {
    const [rows] = await db.execute('SELECT username FROM users WHERE username = ?', [username]);
    res.status(200).json({ available: rows.length === 0 });
  } catch (err) {
    res.status(500).json({ message: 'Error checking username', error: err.message });
  }
};

exports.saveUsername = async (req, res) => {
  const { username } = req.body;
  const userId = req.user.userId;

  try {
    const [rows] = await db.execute('SELECT user_id FROM users WHERE username = ?', [username]);
    if (rows.length > 0) return res.status(409).json({ message: 'Username already taken' });

    await db.execute('UPDATE users SET username = ? WHERE user_id = ?', [username, userId]);
    res.status(200).json({ message: 'Username saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving username', error: err.message });
  }
};

exports.saveLocation = async (req, res) => {
  const { latitude, longitude } = req.body;
  const userId = req.user.userId;

  try {
    await db.execute(
      'UPDATE users SET latitude = ?, longitude = ? WHERE user_id = ?',
      [latitude, longitude, userId]
    );
    res.status(200).json({ message: 'Location saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving location', error: err.message });
  }
};
