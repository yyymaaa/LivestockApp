// livestock-backend/routes/farmer/profile.js

const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// Middleware to log every incoming request to this router
router.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  next();
});

// GET user profile by ID
router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  console.log('👉 GET /api/farmer/profile/:id called with ID:', userId);

  try {
    const [rows] = await db.query(
      `SELECT user_id, name, email, contact FROM user WHERE user_id = ?`,
      [userId]
    );

    console.log('✅ Query result:', rows);

    if (rows.length === 0) {
      console.warn('⚠️ No user found with that ID.');
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    res.json({ user });
  } catch (err) {
    console.error('❌ GET profile error:', err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update user profile
router.put('/:id', async (req, res) => {
  const user_id = req.params.id;
  const { name, email, contact } = req.body;

  console.log('📝 PUT request received');
  console.log('👉 Params:', user_id);
  console.log('👉 Body:', { name, email, contact });

  if (!user_id || !name || !email) {
    console.warn('⚠️ Missing required fields');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [updateResult] = await db.query(
      'UPDATE user SET name = ?, email = ?, contact = ? WHERE user_id = ?',
      [name, email, contact, user_id]
    );

    console.log('✅ Update result:', updateResult);

    const [rows] = await db.query(
      'SELECT user_id, name, email, contact FROM user WHERE user_id = ?',
      [user_id]
    );

    console.log('✅ Fetch after update:', rows);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found after update' });
    }

    const updatedUser = rows[0];
    res.json({ user: updatedUser });

  } catch (err) {
    console.error('❌ PUT profile error:', err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
