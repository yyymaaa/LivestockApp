const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// Remove authentication middleware for test user
// router.use(authenticateToken);

// GET user profile by ID
router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  console.log('GET /api/farmer/profile/:id called with ID:', userId);

  try {
    const [rows] = await db.query(
      `SELECT user_id, name, email, contact_info as contact FROM user WHERE user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: rows[0] });
  } catch (err) {
    console.error('GET profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update user profile
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email, contact } = req.body;

  try {
    await db.query(
      `UPDATE user SET name = ?, email = ?, contact_info = ? WHERE user_id = ?`,
      [name, email, contact, userId]
    );

    const [rows] = await db.query(
      `SELECT user_id, name, email, contact_info as contact FROM user WHERE user_id = ?`,
      [userId]
    );

    res.json({ user: rows[0] });
  } catch (err) {
    console.error('PUT profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;