const db = require('../config/db');

// Insert a new user into the database
exports.insertUser = async (userData) => {
  const {
    name,
    email,
    username,
    password,
    role,
    latitude,
    longitude,
    contact_info
  } = userData;

  const [result] = await db.execute(
    `INSERT INTO users (name, email, username, password, role, latitude, longitude, contact_info, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [name, email, username, password, role, latitude, longitude, contact_info]
  );

  return result;
};

// Find user by email (used in login)
exports.findUserByEmail = async (email) => {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0]; // return user object or undefined
};

// Find user by username (used to check username availability)
exports.findUserByUsername = async (username) => {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  return rows[0];
};

// Update username after registration
exports.updateUsername = async (userId, username) => {
  const [result] = await db.execute(
    'UPDATE users SET username = ? WHERE user_id = ?',
    [username, userId]
  );
  return result.affectedRows > 0;
};

// Get user by ID (after decoding JWT token)
exports.findUserById = async (userId) => {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE user_id = ?',
    [userId]
  );
  return rows[0];
};

// Update user location
exports.updateUserLocation = async (userId, latitude, longitude) => {
  const [result] = await db.execute(
    'UPDATE users SET latitude = ?, longitude = ? WHERE user_id = ?',
    [latitude, longitude, userId]
  );
  return result.affectedRows > 0;
};