const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// Middleware to log every incoming request to this route
router.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  next();
});

// GET /api/productbuyer/profile/:id - fetch user profile
router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  console.log(`🔍 Fetching profile for user_id: ${userId}`);

  try {
    const [rows] = await db.query(
      `SELECT user_id, name, email, contact AS contact FROM user WHERE user_id = ?`,
      [userId]
    );

    console.log('📦 Query result:', rows);

    if (rows.length === 0) {
      console.warn(`⚠️ No user found with ID ${userId}`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ Returning user profile:', rows[0]);
    res.json({ user: rows[0] });
  } catch (err) {
    console.error('❌ Error while fetching profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/productbuyer/profile/:id - update user profile
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email, contact } = req.body;

  console.log(`📝 Updating profile for user_id: ${userId}`);
  console.log('📨 Received update data:', { name, email, contact });

  if (!name || !email) {
    console.warn('⚠️ Missing required fields (name or email)');
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const [updateResult] = await db.query(
      `UPDATE user SET name = ?, email = ?, contact = ? WHERE user_id = ?`,
      [name, email, contact, userId]
    );

    console.log('✅ Update result from DB:', updateResult);

    const [rows] = await db.query(
      `SELECT user_id, name, email, contact AS contact FROM user WHERE user_id = ?`,
      [userId]
    );

    console.log('📦 Fetched updated profile:', rows);

    if (rows.length === 0) {
      console.warn(`❗ User with ID ${userId} not found after update`);
      return res.status(404).json({ error: 'User not found after update' });
    }

    console.log('✅ Returning updated profile:', rows[0]);
    res.json({ user: rows[0] });
  } catch (err) {
    console.error('❌ Error while updating profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;