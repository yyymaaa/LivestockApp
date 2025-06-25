//livestock-backend/routes.farmer/mylistings.js
const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// ✅ GET all listings for a specific user
router.get('/:user_id', async (req, res) => {
  const userId = req.params.user_id;

  try {
    const [results] = await db.query(`
      SELECT pl.*, lm.url AS image_url
      FROM product_listing pl
      LEFT JOIN Listing_media lm ON pl.listing_id = lm.product_listing_id
      WHERE pl.user_id = ?
    `, [userId]);

    res.json(results);
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ GET single listing by ID
router.get('/single/:listingId', async (req, res) => {
  const listingId = req.params.listingId;

  try {
    const [results] = await db.query(`
      SELECT pl.*, GROUP_CONCAT(lm.url) AS images
      FROM product_listing pl
      LEFT JOIN Listing_media lm ON pl.listing_id = lm.product_listing_id
      WHERE pl.listing_id = ?
      GROUP BY pl.listing_id
    `, [listingId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const listing = results[0];
    listing.images = listing.images ? listing.images.split(',') : [];
    res.json(listing);
  } catch (err) {
    console.error('Error fetching single listing:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ POST new listing
router.post('/', async (req, res) => {
  const { title, image, description, price_per_unit, quantity_available, status, user_id } = req.body;

  if (!user_id || !title || !description || !price_per_unit || !quantity_available || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(`
      INSERT INTO product_listing (title, image, description, price_per_unit, quantity_available, status, user_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `, [title, image, description, price_per_unit, quantity_available, status, user_id]);

    res.status(201).json({ message: 'Listing created successfully', listing_id: result.insertId });
  } catch (err) {
    console.error('Error posting listing:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ PUT update listing by ID
router.put('/:listingId', async (req, res) => {
  const listingId = req.params.listingId;
  const { title, image, description, price_per_unit, quantity_available, status } = req.body;

  if (!title || !description || !price_per_unit || !quantity_available || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await db.query(`
      UPDATE product_listing
      SET title = ?, image = ?, description = ?, price_per_unit = ?, quantity_available = ?, status = ?
      WHERE listing_id = ?
    `, [title, image, description, price_per_unit, quantity_available, status, listingId]);

    res.json({ message: 'Listing updated successfully' });
  } catch (err) {
    console.error('Error updating listing:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ DELETE listing by ID
router.delete('/:listingId', async (req, res) => {
  const listingId = req.params.listingId;

  try {
    await db.query('DELETE FROM product_listing WHERE listing_id = ?', [listingId]);
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
