const db = require('../config/db');

exports.insertUser = async (userData) => {
  const { email, username, password, role, latitude, longitude, contact_info } = userData;

  const sql = `
    INSERT INTO user (email, username, password, role, latitude, longitude, contact_info, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  const values = [
    email,
    username || null, 
    password,
    role,
    latitude || null,
    longitude || null,
    contact_info || null
  ];

  try {
    const [result] = await db.execute(sql, values);
    return result;
  } catch (err) {
    console.error('Error inserting user:', err);
    throw new Error('Database error during user registration');
  }
};

exports.findUserByEmail = async (email) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM user WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  } catch (err) {
    console.error('Error finding user by email:', err);
    throw new Error('Database query failed');
  }
};

exports.findUserByUsername = async (username) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM user WHERE username = ?',
      [username]
    );
    return rows[0] || null ;
  } catch (err) {
    console.error('Error finding user by username:', err);
    throw new Error('Database query failed');
  }
};

exports.updateUsername = async (userId, username) => {
  try {
    const [rows] = await db.execute(
      'SELECT user_id FROM user WHERE user_id = ?', 
      [userId]
    );

    if (rows.length === 0) {
      throw new Error('User not found'); 
    }

    const [result] = await db.execute(
      'UPDATE user SET username = ? WHERE user_id = ?',
      [username, userId]
    );
    return result.affectedRows > 0; 
  } catch (err) {
    console.error('Error updating username:', err);
    throw new Error('Database error during username update');
  }
};

exports.findUserById = async (userId) => {
  try{
    const [rows] = await db.execute(
      'SELECT * FROM user WHERE user_id = ?',
      [userId]
    );
    return rows[0] || null;
  } catch (err) {
    console.error('Error finding user by ID:', err);
    throw new Error('Database query failed');
  }
};

exports.updateUserLocation = async (userId, latitude, longitude) => {
  try {
    const [result] = await db.execute(
      'UPDATE user SET latitude = ?, longitude = ? WHERE user_id = ?',
      [latitude, longitude, userId]
    );
    return result.affectedRows > 0;
  } catch (err) {
    console.error('Error updating location:', err);
    throw new Error('Database error during location update');
  }
};
