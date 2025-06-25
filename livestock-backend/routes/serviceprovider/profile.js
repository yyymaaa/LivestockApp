const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// Middleware to log every request
router.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

//  GET service provider profile by ID
router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  console.log(' GET /api/serviceprovider/profile/:id called with ID:', userId);

  try {
    const [rows] = await db.query(
      `SELECT user_id, name, email, contact FROM user WHERE user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      console.warn(' No user found with that ID.');
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    res.json({ user });
  } catch (err) {
    console.error(' GET profile error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//  PUT update service provider profile
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email, contact } = req.body;

  console.log('PUT /api/serviceprovider/profile/:id');
  console.log(' Params:', userId);
  console.log(' Body:', { name, email, contact });

  if (!name || !email) {
    console.warn(' Missing required fields');
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const [updateResult] = await db.query(
      `UPDATE user SET name = ?, email = ?, contact = ? WHERE user_id = ?`,
      [name, email, contact || null, userId]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found or nothing changed' });
    }

    const [rows] = await db.query(
      `SELECT user_id, name, email, contact FROM user WHERE user_id = ?`,
      [userId]
    );

    const updatedUser = rows[0];
    res.json({ user: updatedUser });
  } catch (err) {
    console.error('PUT profile error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
