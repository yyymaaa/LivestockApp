const express = require('express');
const router = express.Router();
const db = require('../../config/db');

router.get('/', async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({
      error: 'Search query is required',
      example: 'Try searching for "goat" or "milk"'
    });
  }

  const searchTerm = `%${query.trim().toLowerCase()}%`;

  const sql = `
    SELECT 
      p.listing_id,
      p.title,
      p.description,
      p.price_per_unit,
      p.quantity_available,
      p.status,
      p.created_at,
      u.name AS farmer_name,
      u.contact,
      lm.url AS image_url
    FROM product_listing p
    JOIN user u ON p.user_id = u.user_id
    LEFT JOIN listing_media lm ON p.listing_id = lm.product_listing_id
    WHERE (
      LOWER(p.title) LIKE ? OR 
      LOWER(p.description) LIKE ? OR 
      LOWER(u.name) LIKE ?
    ) AND p.status = 'available'
    ORDER BY p.created_at DESC
  `;

  try {
    const [results] = await db.query(sql, [searchTerm, searchTerm, searchTerm]);

    const listings = results.map(item => ({
      ...item,
      image_url: item.image_url || null
    }));

    res.json(listings);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to search listings' });
  }
});

module.exports = router;
