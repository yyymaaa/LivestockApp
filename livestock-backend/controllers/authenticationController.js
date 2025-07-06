const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { insertUser, findUserByEmail } = require('../models/userModel');
const generateJWT = require('../utilities/generateJWT');
const { findUserById } = require('../models/userModel');

exports.registerUser = async (req, res) => {
  try {
    const { email, password, role, username, latitude, longitude, contact_info } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await insertUser({
      email,
      username: username || null,
      password: hashedPassword,
      role,
      latitude: latitude || null,
      longitude: longitude || null,
      contact_info: contact_info || null,
    });

    const userId = result.insertId;

    const token = generateJWT({
      id: userId,
      email,
      role
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        email,
        role,
        username: username || null,
      },
    });

  } catch (error) {
    console.error('Registration error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'User already exists.' });
    }

    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateJWT({
          id: user.user_id,  
          email: user.email,
          role: user.role
        });

    res.status(200).json({
       token,
       user:{
        id: user.user_id,
        email: user.email,
        role: user.role,
        username: user.username || null,
       },
      });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
