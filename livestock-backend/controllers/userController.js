const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../config/db');
const generateToken = require('../utilities/generateJWT');
const { insertUser, findUserByEmail } = require('../models/userModel');



const { findUserById } = require('../models/userModel');

exports.getAuthenticatedUser = async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
  }

  try {
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};

exports.checkUsernameAvailability = async (req, res) => {
  const { username } = req.params;

  try {
    const [rows] = await db.execute('SELECT username FROM user WHERE username = ?', [username]);
    res.status(200).json({ available: rows.length === 0 });
  } catch (err) {
    res.status(500).json({ message: 'Error checking username', error: err.message });
  }
};

exports.saveUsername = async (req, res) => {
  const { username } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
  }

  try {
    const [rows] = await db.execute (
      'SELECT user_id FROM user WHERE username = ?',
       [username]
      );

    if (rows.length > 0 && rows[0].user_id !== userId) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    if (rows.length > 0 && rows[0].user_id === userId) {
      return res.status(200).json({ message: 'Username already saved', success: true });
    }

    await db.execute(
      'UPDATE user SET username = ? WHERE user_id = ?',
      [username, userId]
    );

      res.status(200).json({ message: 'Username saved successfully', success: true });
    } catch (err) {
      console.error('Error saving username:', err);
      res.status(500).json({ message: 'Error saving username', error: err.message });
    }
};

exports.saveLocation = async (req, res) => {
  const { latitude, longitude } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
  }

  try {
    await db.execute(
      'UPDATE user SET latitude = ?, longitude = ? WHERE user_id = ?',
      [latitude, longitude, userId]
    );
    res.status(200).json({ message: 'Location saved successfully' });
  } catch (err) {
    console.error('Error saving location:', err);
    res.status(500).json({ message: 'Error saving location', error: err.message });
  }
};


