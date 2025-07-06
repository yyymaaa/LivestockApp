const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// GET all listings for a specific farmer
router.get('/:farmerId', async (req, res) => {
  const farmerId = req.params.farmerId;
  console.log(`Fetching listings for farmer ID: ${farmerId}`);

  try {
    // Get product listings with their media
    const [listings] = await db.query(`
      SELECT pl.*, lm.url as image_url 
      FROM product_listing pl
      LEFT JOIN listing_media lm ON pl.listing_id = lm.product_listing_id
      WHERE pl.user_id = ?
    `, [farmerId]);

    // Group listings with their images
    const listingsWithMedia = listings.reduce((acc, listing) => {
      const existing = acc.find(l => l.listing_id === listing.listing_id);
      if (existing) {
        if (listing.image_url) {
          existing.media = existing.media || [];
          existing.media.push({ url: listing.image_url });
        }
      } else {
        const newListing = { ...listing };
        if (listing.image_url) {
          newListing.media = [{ url: listing.image_url }];
        } else {
          newListing.media = [];
        }
        delete newListing.image_url;
        acc.push(newListing);
      }
      return acc;
    }, []);

    console.log(`Fetched ${listingsWithMedia.length} listings`);
    res.json(listingsWithMedia);
  } catch (err) {
    console.error('Error fetching listings:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

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

    // Start transaction
    await db.query('START TRANSACTION');

    // Insert into product_listing
    const [listingResult] = await db.query(`
      INSERT INTO product_listing
      (user_id, title, description, price_per_unit, quantity_available, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [user_id, title, description, price, quantity, status.toLowerCase(), created_at]);

    const listingId = listingResult.insertId;
    console.log(`Inserted product_listing ID: ${listingId}`);

    // Insert into listing_media
    await db.query(`
      INSERT INTO listing_media
      (product_listing_id, url, created_at)
      VALUES (?, ?, ?)
    `, [listingId, image, created_at]);

    // Commit transaction
    await db.query('COMMIT');

    res.status(201).json({ 
      message: 'Listing and image saved successfully', 
      id: listingId,
      imageUrl: image
    });
  } catch (err) {
    // Rollback on error
    await db.query('ROLLBACK');
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
    // Start transaction
    await db.query('START TRANSACTION');

    // Update product_listing
    const [result] = await db.query(
      `UPDATE product_listing
       SET title = ?, description = ?, price_per_unit = ?, quantity_available = ?, status = ?
       WHERE listing_id = ?`,
      [title, description, price, quantity, status.toLowerCase(), listingId]
    );

    if (result.affectedRows === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Listing not found' });
    }

    console.log(`Updated ${result.affectedRows} listing(s)`);

    // Handle image update
    if (image) {
      // Check if media exists
      const [existingMedia] = await db.query(
        'SELECT photo_id FROM listing_media WHERE product_listing_id = ? LIMIT 1',
        [listingId]
      );

      if (existingMedia.length > 0) {
        // Update existing media
        await db.query(
          'UPDATE listing_media SET url = ?, created_at = NOW() WHERE product_listing_id = ?',
          [image, listingId]
        );
      } else {
        // Insert new media
        await db.query(
          'INSERT INTO listing_media (product_listing_id, url, created_at) VALUES (?, ?, NOW())',
          [listingId, image]
        );
      }
    }

    // Commit transaction
    await db.query('COMMIT');

    res.json({ 
      message: 'Listing updated successfully',
      updatedFields: { title, description, price, quantity, status, image }
    });
  } catch (err) {
    // Rollback on error
    await db.query('ROLLBACK');
    console.error('Database error:', err.message);
    res.status(500).json({ 
      error: 'Database error', 
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// DELETE listing
router.delete('/:listingId', async (req, res) => {
  const listingId = req.params.listingId;
  console.log(`Received DELETE request for listing ID: ${listingId}`);

  try {
    // Start transaction
    await db.query('START TRANSACTION');

    // Delete associated media first
    await db.query(
      'DELETE FROM listing_media WHERE product_listing_id = ?',
      [listingId]
    );

    // Then delete the listing
    const [result] = await db.query(
      'DELETE FROM product_listing WHERE listing_id = ?',
      [listingId]
    );

    if (result.affectedRows === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Commit transaction
    await db.query('COMMIT');

    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    // Rollback on error
    await db.query('ROLLBACK');
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

module.exports = router;