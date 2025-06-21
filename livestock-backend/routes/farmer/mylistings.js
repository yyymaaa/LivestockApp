const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// GET all listings for a specific farmer
router.get('/:farmerId', async (req, res) => {
  const farmerId = req.params.farmerId;

  try {
    const [results] = await db.query('SELECT * FROM product_listing WHERE user_id = ?', [farmerId]);
    res.json(results);
  } catch (err) {
    console.error('Error fetching listings:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST new listing
router.post('/', async (req, res) => {
  const { title, image, description, price, quantity, status, user_id } = req.body;

  if (!user_id || !title || !description || !price || !quantity || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(`
      INSERT INTO product_listing (title, image, description, price, quantity, status, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [title, image, description, price, quantity, status, user_id]);

    res.status(201).json({ message: 'Listing created successfully', id: result.insertId });
  } catch (err) {
    console.error('Error posting listing:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT update listing
router.put('/:listingId', async (req, res) => {
  const listingId = req.params.listingId;
  const { title, image, description, price, quantity, status } = req.body;

  try {
    await db.query(`
      UPDATE product_listing
      SET title = ?, image = ?, description = ?, price = ?, quantity = ?, status = ?
      WHERE id = ?
    `, [title, image, description, price, quantity, status, listingId]);

    res.json({ message: 'Listing updated successfully' });
  } catch (err) {
    console.error('Error updating listing:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE listing
router.delete('/:listingId', async (req, res) => {
  const listingId = req.params.listingId;

  try {
    await db.query('DELETE FROM product_listing WHERE id = ?', [listingId]);
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    console.error('Error deleting listing:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
