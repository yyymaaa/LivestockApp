const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// GET all listings for a specific farmer
router.get('/:farmerId', async (req, res) => {
  const farmerId = req.params.farmerId;
  console.log(`Fetching listings for farmer ID: ${farmerId}`);

  try {
    const [results] = await db.query(
      'SELECT * FROM product_listing WHERE user_id = ?', [farmerId]
    );
    console.log(`Fetched ${results.length} listings`);
    res.json(results);
  } catch (err) {
    console.error('Error fetching listings:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// POST new listing
// POST new product listing
router.post('/', async (req, res) => {
  let { title, image, description, price, quantity, status, user_id } = req.body;

  console.log('Received body:', req.body);

  user_id = parseInt(user_id);

  if (!user_id || !title || !description || !price || !quantity || !status || !image) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const created_at = new Date();

    // Insert into product_listing
    const [listingResult] = await db.query(`
      INSERT INTO product_listing
      (title, description, price_per_unit, quantity_available, status, user_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [title, description, price, quantity, status.toLowerCase(), user_id, created_at]);

    const listingId = listingResult.insertId;
    console.log(`Inserted product_listing ID: ${listingId}`);

    // Insert into listing_media (with service_listing_id set to NULL)
    await db.query(`
      INSERT INTO listing_media
      (product_listing_id, service_listing_id, url, created_at)
      VALUES (?, NULL, ?, ?)
    `, [listingId, image, created_at]);

    res.status(201).json({ message: 'Listing and image saved successfully', id: listingId });
  } catch (err) {
    console.error('MySQL Error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});


// PUT update listing
router.put('/:listingId', async (req, res) => {
  const listingId = req.params.listingId;
  const { title, image, description, price, quantity, status } = req.body;

  console.log(`Received PUT request to update listing ID ${listingId}`);
  console.log('Update data:', req.body);

  try {
    const [result] = await db.query(
      `UPDATE product_listing
       SET title = ?, image = ?, description = ?, price_per_unit = ?, quantity_available = ?, status = ?
       WHERE listing_id = ?`,
      [title, image, description, price, quantity, status, listingId]
    );

    console.log(`Update successful. Rows affected: ${result.affectedRows}`);
    res.json({ message: 'Listing updated successfully' });
  } catch (err) {
    console.error('Database error during UPDATE:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// DELETE listing
router.delete('/:listingId', async (req, res) => {
  const listingId = req.params.listingId;
  console.log(`Received DELETE request for listing ID: ${listingId}`);

  try {
    const [result] = await db.query(
      'DELETE FROM product_listing WHERE listing_id = ?', [listingId]
    );

    console.log(`Delete successful. Rows affected: ${result.affectedRows}`);
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    console.error('Database error during DELETE:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

module.exports = router;
